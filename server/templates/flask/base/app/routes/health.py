from __future__ import annotations

from datetime import datetime, timezone

from flask import Blueprint

from app.utils.response import success_response


health_bp = Blueprint("health", __name__)


@health_bp.get("/api/health")
def health():
    now = datetime.now(timezone.utc).isoformat()
    return success_response(
        message="Server healthy",
        data={
            "status": "ok",
            "timestamp": now,
        },
    )
