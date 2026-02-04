# from pydantic import BaseSettings
from pydantic_settings import BaseSettings 


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./test.db"  # or postgres
    FINTERNET_BASE_URL: str = "https://api.fmm.finternetlab.io"
    FINTERNET_API_KEY: str = ""

settings = Settings()
