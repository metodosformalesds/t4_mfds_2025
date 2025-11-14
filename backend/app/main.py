# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.database import engine, Base
from core.config import settings

# Importar todos los routers
from api.routes import auth, users, products, orders, reviews, favorites, cart, payments

# Crear tablas
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ArteMex API",
    description="E-commerce platform for Mexican artisans",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://main.dk8x1ivj443zp.amplifyapp.com/"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(products.router, prefix="/api/products", tags=["products"])
app.include_router(orders.router, prefix="/api/orders", tags=["orders"])
app.include_router(reviews.router, prefix="/api/reviews", tags=["reviews"])
app.include_router(favorites.router, prefix="/api/favorites", tags=["favorites"])
app.include_router(cart.router, prefix="/api/cart", tags=["cart"])
app.include_router(payments.router, prefix="/api/payments", tags=["payments"])

@app.get("/")
def root():
    return {"message": "ArteMex API is running!"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}