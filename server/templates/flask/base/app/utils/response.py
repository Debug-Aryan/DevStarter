from __future__ import annotations

from dataclasses import dataclass

from flask import jsonify


@dataclass
class ApiError(Exception):
    message: str
    status_code: int = 400
    errors: dict | None = None


def success_response(message: str, data: dict | None = None, status_code: int = 200):
    payload = {
        "success": True,
        "message": message,
        "data": data or {},
    }
    return jsonify(payload), status_code


def error_response(message: str, status_code: int = 400, errors: dict | None = None):
    payload = {
        "success": False,
        "message": message,
        "errors": errors or {},
    }
    return jsonify(payload), status_code
