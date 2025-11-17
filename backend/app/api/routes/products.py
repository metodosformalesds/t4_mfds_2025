# app/api/routes/products.py
from fastapi import APIRouter, Depends, HTTPException, status, Query, File, UploadFile, Form, Request
from sqlalchemy.orm import Session
from typing import Optional, List
from core.database import get_db
from api.dependencies import get_current_user
from schemas.product import ProductResponse, ProductCreate, ProductUpdate, ProductWithArtist
from schemas.user import UserResponse
from services.product_service import ProductService
from services.s3_service import S3Service

router = APIRouter()
product_service = ProductService()
s3_service = S3Service()

@router.get("/", response_model=List[ProductWithArtist])
def get_products(
    skip: int = 0,
    limit: int = 20,
    category: Optional[str] = Query(None, description="Filter by category: 'producto' or 'material'"),
    db: Session = Depends(get_db)
):
    """
    Autor: Raúl Aniles 222802

    Descripción: Obtiene una lista paginada de productos, opcionalmente filtrada por categoría.

    Parámetros:
        skip (int): Offset para paginación.
        limit (int): Límite de resultados.
        category (Optional[str]): Filtro de categoría.
        db (Session): Sesión de la base de datos.

    Retorna:
        List[ProductWithArtist]: Lista de productos.

    """
    products = product_service.get_products(db, skip=skip, limit=limit, category=category)
    return products

@router.get("/my-products", response_model=List[ProductResponse])
def get_my_products(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    """
    Autor: Raúl Aniles 222802

    Descripción: Obtiene los productos creados por el usuario autenticado.

    Parámetros:
        skip (int): Offset para paginación.
        limit (int): Límite de resultados.
        db (Session): Sesión de la base de datos.
        current_user (UserResponse): Usuario autenticado.

    Retorna:
        List[ProductResponse]: Lista de productos del usuario.

    """
    products = product_service.get_products(db, skip=skip, limit=limit, user_id=current_user.id)
    return products

@router.get("/{product_id}", response_model=ProductWithArtist)
def get_product(product_id: int, db: Session = Depends(get_db)):
    """
    Autor: Raúl Aniles 222802

    Descripción: Obtiene un producto por su ID y aumenta el contador de vistas.

    Parámetros:
        product_id (int): ID del producto.
        db (Session): Sesión de la base de datos.

    Retorna:
        ProductWithArtist: Producto solicitado.

    """
    product = product_service.get_product(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Incrementar contador de vistas
    product_service.increment_view_count(db, product_id)
    
    return product

@router.post("/", response_model=ProductResponse)
async def create_product(
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user),
    name: str = Form(...),
    description: Optional[str] = Form(None),
    price: float = Form(...),
    category: str = Form(...),
    stock: int = Form(1),
    address: str = Form(...),
    images: Optional[List[UploadFile]] = File(None),
):
    """
    Autor: Raúl Aniles 222802

    Descripción: Crea un producto y permite subir hasta 5 imágenes al bucket S3.

    Parámetros:
        db (Session): Sesión de la base de datos.
        current_user (UserResponse): Usuario autenticado.
        name (str): Nombre del producto.
        description (Optional[str]): Descripción.
        price (float): Precio.
        category (str): Categoría.
        stock (int): Stock.
        address (str): Dirección del producto.
        images (Optional[List[UploadFile]]): Lista de archivos de imagen.

    Retorna:
        ProductResponse: Producto creado.

    """
    # Validar cantidad de imágenes
    image_urls = []
    if images:
        if len(images) > 5:
            raise HTTPException(status_code=400, detail="Máximo 5 imágenes por producto")

        for img in images:
            if not img.content_type.startswith("image/"):
                raise HTTPException(status_code=400, detail="Todas las subidas deben ser imágenes")
            content = await img.read()
            try:
                url = s3_service.upload_file(content, img.filename, folder="products")
                image_urls.append(url)
            except ValueError as e:
                raise HTTPException(status_code=400, detail=str(e))

    product_data = {
        "name": name,
        "description": description,
        "price": price,
        "category": category,
        "stock": stock,
        "address": address,
        "images": image_urls,
    }

    product_obj = ProductCreate(**product_data)
    return product_service.create_product(db, product_obj, current_user.id)

@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user),
    name: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    price: Optional[float] = Form(None),
    category: Optional[str] = Form(None),
    stock: Optional[int] = Form(None),
    address: Optional[str] = Form(None),
    is_available: Optional[bool] = Form(None),
    images: Optional[List[UploadFile]] = File(None),
):
    """
    Autor: Raúl Aniles 222802

    Descripción: Actualiza un producto. Acepta multipart/form-data para reemplazar imágenes.

    Parámetros:
        product_id (int): ID del producto a actualizar.
        db (Session): Sesión de la base de datos.
        current_user (UserResponse): Usuario autenticado.
        name, description, price, category, stock, address, is_available: Campos opcionales vía Form.
        images (Optional[List[UploadFile]]): Lista de imágenes nuevas (si se proporcionan, reemplazan las antiguas).

    Retorna:
        ProductResponse: Producto actualizado.

    """
    # Verificar que el producto pertenece al usuario
    product = product_service.get_product(db, product_id)
    if not product or product.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Manejar imágenes si se suben nuevas: reemplazar las anteriores
    if images is not None:
        if len(images) > 5:
            raise HTTPException(status_code=400, detail="Máximo 5 imágenes por producto")

        # Eliminar imágenes antiguas
        if product.images:
            for old_url in product.images:
                try:
                    s3_service.delete_profile_picture(old_url)
                except Exception:
                    pass

        new_urls = []
        for img in images:
            if not img.content_type.startswith("image/"):
                raise HTTPException(status_code=400, detail="Todas las subidas deben ser imágenes")
            content = await img.read()
            try:
                url = s3_service.upload_file(content, img.filename, folder="products")
                new_urls.append(url)
            except ValueError as e:
                raise HTTPException(status_code=400, detail=str(e))

        # Empaquetar en ProductUpdate
        product_update = ProductUpdate(images=new_urls)
    else:
        product_update = ProductUpdate(
            name=name,
            description=description,
            price=price,
            category=category,
            stock=stock,
            address=address,
            is_available=is_available,
        )

    updated_product = product_service.update_product(db, product_id, product_update)
    if not updated_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return updated_product


@router.patch("/{product_id}", response_model=ProductResponse)
async def patch_product(
    product_id: int,
    request: Request,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user),
):
    """
    Autor: Raúl Aniles 222802

    Descripción: Actualización parcial del producto vía JSON (application/json). Permite enviar
    una lista de URLs en `images` para sincronizar imágenes (elimina las que no estén en la lista).

    Parámetros:
        product_id (int): ID del producto.
        request (Request): Request con el JSON a aplicar.
        db (Session): Sesión de la base de datos.
        current_user (UserResponse): Usuario autenticado.

    Retorna:
        ProductResponse: Producto actualizado.

    """
    # Verificar propiedad del producto
    product = product_service.get_product(db, product_id)
    if not product or product.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Product not found")

    try:
        body = await request.json()

        # Permitir solo campos válidos
        allowed = {"name", "description", "price", "category", "stock", "address", "is_available", "images"}
        update_data = {k: v for k, v in body.items() if k in allowed}

        # Manejo especial para imágenes
        if "images" in update_data:
            imgs = update_data.get("images") or []
            if not isinstance(imgs, list):
                raise HTTPException(status_code=400, detail="El campo 'images' debe ser una lista de URLs")

            if len(imgs) > 5:
                raise HTTPException(status_code=400, detail="Máximo 5 imágenes por producto")

            # Eliminar imágenes antiguas que no estén en la nueva lista
            old_imgs = product.images or []
            for old in old_imgs:
                if old not in imgs:
                    try:
                        s3_service.delete_profile_picture(old)
                    except Exception:
                        pass

            # asignar nuevas imágenes (listas de URLs)
            update_data["images"] = imgs

        # Crear esquema ProductUpdate con los campos recibidos
        product_update = ProductUpdate(**update_data)
        updated = product_service.update_product(db, product_id, product_update)
        if not updated:
            raise HTTPException(status_code=404, detail="Product not found")

        return updated

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating product (patch): {str(e)}")