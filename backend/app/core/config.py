import os

class Settings:
    PROJECT_NAME: str = "I-STELX - Indian Steel Transportation, Efficient Logistics & eXchange"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "istelx_maritime_intel_secret_key_2026_jwt_token_secure_signature")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./istelx.db")
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "*"
    ]
    SIMULATION_INTERVAL_SECONDS: int = 3
    SIMULATED_DATA_NOTICE: str = "DEMO / SIMULATED AIS & MARITIME DATA - FOR DECISION SUPPORT DEMONSTRATION"

settings = Settings()
