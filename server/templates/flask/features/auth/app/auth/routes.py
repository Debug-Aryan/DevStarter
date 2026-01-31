from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
# from app.models import User # In a real app, import User model

auth = Blueprint('auth', __name__)

# Mock database
users_db = {} 

@auth.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password required'}), 400

    if email in users_db:
        return jsonify({'error': 'User already exists'}), 400

    users_db[email] = generate_password_hash(password)
    return jsonify({'message': 'User registered successfully'}), 201

@auth.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password required'}), 400

    user_password_hash = users_db.get(email)

    if user_password_hash and check_password_hash(user_password_hash, password):
        # In a real app, generate a JWT token here
        return jsonify({'message': 'Login successful', 'token': 'fake-jwt-token'}), 200

    return jsonify({'error': 'Invalid credentials'}), 401
