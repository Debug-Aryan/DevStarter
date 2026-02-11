from __future__ import annotations

from flask import Blueprint, request
from flask_jwt_extended import jwt_required

from app.services.auth_service import AuthService
from app.utils.response import ApiError, success_response


auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


auth_service = AuthService()


@auth_bp.post("/register")
def register():
    payload = request.get_json(silent=True) or {}
    email = (payload.get("email") or "").strip().lower()
    password = payload.get("password") or ""

    user, access_token = auth_service.register(email=email, password=password)
    return success_response(
        message="User registered",
        data={"user": user.to_dict(), "access_token": access_token},
        status_code=201,
    )


@auth_bp.post("/login")
def login():
    payload = request.get_json(silent=True) or {}
    email = (payload.get("email") or "").strip().lower()
    password = payload.get("password") or ""

    user, access_token = auth_service.login(email=email, password=password)
    return success_response(
        message="Login successful",
        data={"user": user.to_dict(), "access_token": access_token},
    )


@auth_bp.get("/me")
@jwt_required()
def me():
    user = auth_service.get_current_user()
    if not user:
        raise ApiError("User not found", status_code=404)

    return success_response(message="Authenticated", data={"user": user.to_dict()})
