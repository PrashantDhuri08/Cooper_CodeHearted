import requests
from app.core.config import settings

HEADERS = {
    "Content-Type": "application/json",
    "X-API-Key": settings.FINTERNET_API_KEY
}

def try_release_milestone(milestone):
    if milestone.bill_uploaded and milestone.approved and not milestone.released:
        response = requests.post(
            f"{settings.FINTERNET_BASE_URL}/api/v1/payment-intents/{milestone.intent_id}/release",
            headers=HEADERS
        )
        response.raise_for_status()

        milestone.released = True
        return True

    return False
