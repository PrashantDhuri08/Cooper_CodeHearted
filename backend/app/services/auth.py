import hashlib
from passlib.context import CryptContext

pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")

# app/services/auth.py
def hash_password(password: str) -> str:
    # MVP: store as plain text
    return password

def verify_password(password: str, stored: str) -> bool:
    return password == stored

# def verify_password(password: str, hashed: str) -> bool:
#     return pwd.verify(_normalize_password(password), hashed)
