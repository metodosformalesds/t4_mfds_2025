# app/api/routes/reviews.py
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from core.database import get_db
from api.dependencies import get_current_user
from schemas.review import ReviewResponse, ReviewCreate
from schemas.user import UserResponse
from services.review_services import ReviewService

router = APIRouter()
review_service = ReviewService()

@router.post("/", response_model=ReviewResponse)
def create_review(
    review: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    try:
        return review_service.create_review(db, review, current_user.id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.get("/product/{product_id}", response_model=List[ReviewResponse])
def get_product_reviews(product_id: int, db: Session = Depends(get_db)):
    reviews = review_service.get_product_reviews(db, product_id)
    return reviews

@router.get("/my-reviews", response_model=List[ReviewResponse])
def get_my_reviews(
    role: str = Query("reviewer", description="Role: 'reviewer' or 'seller'"),
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    reviews = review_service.get_user_reviews(db, current_user.id, role)
    return reviews