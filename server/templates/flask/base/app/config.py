from __future__ import annotations

import os
from pathlib import Path


def _require_env(name: str, *, min_length: int | None = None) -> str:
    value = os.getenv(name)
    if not value:
        raise RuntimeError(
            f"Missing required environment variable: {name}. "
            f"Create a .env file (see .env.example) and set {name}."
        )
    if min_length is not None and len(value) < min_length:
        raise RuntimeError(
            f"{name} is too short. Use at least {min_length} characters for production safety."
        )
    return value


def _default_sqlite_uri() -> str:
    # Store the SQLite file in the project root for beginner-friendliness.
    base_dir = Path(__file__).resolve().parents[1]
    db_path = base_dir / "app.db"
    return f"sqlite:///{db_path.as_posix()}"


class Config:
    """Central application configuration.

    Notes:
    - `.env` is loaded in the app factory before this class is instantiated.
    - Secrets are REQUIRED and must come from environment variables.
    """

    def __init__(self) -> None:
        flask_env = os.getenv("FLASK_ENV", "production")

        self.FLASK_ENV = flask_env
        self.DEBUG = flask_env.lower() == "development"

        self.SECRET_KEY = _require_env("SECRET_KEY", min_length=32)
        self.JWT_SECRET_KEY = _require_env("JWT_SECRET_KEY", min_length=32)

        database_url = os.getenv("DATABASE_URL")
        self.SQLALCHEMY_DATABASE_URI = database_url or _default_sqlite_uri()
        self.SQLALCHEMY_TRACK_MODIFICATIONS = False

        # CORS is configurable. Use "*" for local dev, or a comma-separated list.
        # Example: "http://localhost:5173,https://yourdomain.com"
        self.CORS_ORIGINS = os.getenv("CORS_ORIGINS")
