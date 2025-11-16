# app/api/routes/payments.py
from fastapi import APIRouter

router = APIRouter()

# NOTE: Endpoints for Stripe integration (account links, payment intents
# and webhooks) were consolidated into `app.api.routes.stripe` to avoid
# duplication. This file remains as a placeholder for future payment
# specific routes. If you need to add payment-only endpoints, add them
# here; otherwise you can safely remove this file.
