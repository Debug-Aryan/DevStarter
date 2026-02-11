from __future__ import annotations

from flask_jwt_extended import create_access_token, get_jwt_identity

from app.models.user import User
from app.services.user_service import UserService
from app.utils.response import ApiError


class AuthService:
    def __init__(self):
        self.user_service = UserService()

    def register(self, email: str, password: str) -> tuple[User, str]:
        user = self.user_service.create_user(email=email, password=password)
        token = create_access_token(identity=str(user.id))
        return user, token

    def login(self, email: str, password: str) -> tuple[User, str]:
        if not email:
            raise ApiError("Email is required", status_code=400)
        if not password:
            raise ApiError("Password is required", status_code=400)

        user = self.user_service.get_by_email(email)
        if not user or not user.check_password(password):
            raise ApiError("Invalid email or password", status_code=401)

        token = create_access_token(identity=str(user.id))
        return user, token

    def get_current_user(self) -> User | None:
        identity = get_jwt_identity()
        if identity is None:
            return None
        return self.user_service.get_by_id(int(identity))
