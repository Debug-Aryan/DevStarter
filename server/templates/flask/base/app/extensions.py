from __future__ import annotations

from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()
jwt = JWTManager()
cors = CORS()


def _parse_cors_origins(raw: str | None):
	if not raw:
		return None
	raw = raw.strip()
	if raw == "*":
		return "*"
	return [origin.strip() for origin in raw.split(",") if origin.strip()]


def init_extensions(app: Flask) -> None:
	db.init_app(app)
	jwt.init_app(app)

	origins = _parse_cors_origins(app.config.get("CORS_ORIGINS"))
	if origins:
		cors.init_app(
			app,
			resources={r"/api/*": {"origins": origins}},
			supports_credentials=True,
		)
