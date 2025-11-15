# Import all models to register them with Base
from .user import User
from .product import Product
from .order import Order
from .orderproduct import OrderProduct
from .review import Review
from .payment import Payment
from .favoriteproduct import FavoriteProduct
from .favoriteartist import FavoriteArtist
from .cartitem import CartItem

__all__ = [
    "User",
    "Product",
    "Order",
    "OrderProduct",
    "Review",
    "Payment",
    "FavoriteProduct",
    "FavoriteArtist",
    "CartItem",
]
