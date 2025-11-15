from pydantic import BaseModel, ConfigDict
from datetime import datetime
from .user import UserResponse
from .product import ProductResponse

class FavoriteProductBase(BaseModel):
    product_id: int

class FavoriteProductResponse(BaseModel):
    id:int
    product: ProductResponse
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class FavoriteArtistBase(BaseModel):
    artist_id: int
    
class FavoriteArtistResponse(BaseModel):
    id:int
    artist: UserResponse
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
