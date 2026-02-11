from __future__ import annotations

from app.extensions import db
from app.models.user import User
from app.utils.response import ApiError


class UserService:
    def get_by_id(self, user_id: int) -> User | None:
        return db.session.get(User, user_id)

    def get_by_email(self, email: str) -> User | None:
        return User.query.filter_by(email=email).first()

    def create_user(self, email: str, password: str) -> User:
        if not email:
            raise ApiError("Email is required", status_code=400)
        if not password or len(password) < 8:
            raise ApiError("Password must be at least 8 characters", status_code=400)

        existing = self.get_by_email(email)
        if existing:
            raise ApiError("Email already registered", status_code=409)

        user = User(email=email)
        user.set_password(password)

        db.session.add(user)
        db.session.commit()
        return user
