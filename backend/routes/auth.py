from flask import Blueprint, request, jsonify
from models import Employee
from extensions import db
import jwt
import datetime

auth_bp = Blueprint("auth", __name__)
SECRET = "supersecretkey"

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    user = Employee.query.filter_by(login_id=data["login_id"]).first()

    if not user or user.password != data["password"]:
        return jsonify({"error": "Invalid credentials"}), 401

    token = jwt.encode({
        "id": user.id,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=10)
    }, SECRET, algorithm="HS256")

    return jsonify({
        "token": token,
        "user": {
            "id": user.id,
            "login_id": user.login_id,
            "name": user.name,
            "email": user.email,
            "department": user.department,
            "position": user.position,
            "role": "employee"
        }
    })

