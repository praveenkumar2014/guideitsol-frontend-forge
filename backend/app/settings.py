from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=(".env", "../.env"), extra="ignore")

    supabase_url: str = ""
    supabase_anon_key: str = ""
    supabase_service_role_key: str = ""

    cashfree_app_id: str = ""
    cashfree_secret_key: str = ""
    cashfree_webhook_secret: str = ""
    cashfree_env: str = "sandbox"

    # Public origin that hosts the frontend (used to build payment return URLs).
    frontend_url: str = "http://localhost:5173"
    # The public URL of this API (used for webhook notify URLs in sandbox).
    public_api_base_url: str = "http://localhost:8000"

    # Secret that protects the admin endpoints. The frontend admin area sends
    # this in the `X-Admin-Key` header. Never expose it in a client bundle.
    admin_api_key: str = ""

    # CORS origins (comma separated) allowed to call this API from the browser.
    cors_origins: str = "http://localhost:5173,http://localhost:4173"

    # Optional transactional email via SMTP. When unset, the emailer logs and
    # skips delivery so local/dev setups keep working without credentials.
    email_smtp_host: str = ""
    email_smtp_port: int = 587
    email_smtp_user: str = ""
    email_smtp_password: str = ""
    email_from: str = "GUIDESOFT <no-reply@guideitsol.com>"
    email_admin_to: str = "info@guideitsol.com"

    @property
    def cashfree_base_url(self) -> str:
        return "https://api.cashfree.com" if self.cashfree_env == "production" else "https://sandbox.cashfree.com"

    @property
    def cashfree_mode(self) -> str:
        return "production" if self.cashfree_env == "production" else "sandbox"

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
