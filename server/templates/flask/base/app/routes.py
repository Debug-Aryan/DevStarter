from flask import Blueprint, jsonify

main = Blueprint('main', __name__)

@main.route('/api/health')
def health_check():
    return jsonify({'status': 'ok'})

@main.route('/')
def home():
    return jsonify({'message': 'Welcome to __PROJECT_NAME__ API'})
