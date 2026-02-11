from __future__ import annotations

from flask import Flask
from dotenv import load_dotenv

from app.extensions import init_extensions
from app.routes.auth import auth_bp
from app.routes.health import health_bp
from app.utils.response import ApiError, error_response


def _register_error_handlers(app: Flask) -> None:
    @app.errorhandler(ApiError)
    def handle_api_error(err: ApiError):
        return error_response(
            message=err.message,
            status_code=err.status_code,
            errors=err.errors,
        )

    @app.errorhandler(404)
    def handle_404(_):
        return error_response(message="Route not found", status_code=404)

    @app.errorhandler(405)
    def handle_405(_):
        return error_response(message="Method not allowed", status_code=405)

    @app.errorhandler(Exception)
    def handle_unexpected_error(err: Exception):
        app.logger.exception("Unhandled exception: %s", err)
        return error_response(message="Internal server error", status_code=500)


def create_app() -> Flask:
    load_dotenv()

    from app.config import Config

    app = Flask(__name__)
    app.config.from_object(Config())

    init_extensions(app)

    app.register_blueprint(health_bp)
    app.register_blueprint(auth_bp)

    _register_error_handlers(app)

    # Beginner-friendly: create tables automatically on first run.
    # For production teams, replace with migrations.
    from app.extensions import db

    with app.app_context():
        db.create_all()

    return app
