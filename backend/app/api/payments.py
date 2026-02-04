from fastapi import APIRouter
import requests
from app.core.config import settings

router = APIRouter(prefix="/payments", tags=["Payments"])

@router.get("/{intent_id}/status")
def get_status(intent_id: str):
    r = requests.get(
        f"{settings.FINTERNET_BASE_URL}/api/v1/payment-intents/{intent_id}",
        headers={"X-API-Key": settings.FINTERNET_API_KEY}
    )
    r.raise_for_status()
    data = r.json()["data"]
    return {
        "intent_id": data["id"],
        "status": data["status"],
        "settlement_status": data.get("settlementStatus")
    }
