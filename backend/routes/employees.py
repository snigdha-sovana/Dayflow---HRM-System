hfrom flask import Blueprint, request, jsonify
from models import Employee
from extensions import db
import random

employee_bp = Blueprint("employee", __name__)

@employee_bp.route("/", methods=["POST"])
def create_employee():
    data = request.json
    login_id = "EMP" + str(random.randint(1000,9999))

    emp = Employee(
        login_id=login_id,
        name=data["name"],
        email=data["email"],
        mobile=data["mobile"],
        department=data["department"],
        position=data["position"],
        password="welcome123"
    )
    db.session.add(emp)
    db.session.commit()
    return jsonify({"login_id": login_id})

@employee_bp.route("/", methods=["GET"])
def get_employees():
    employees = Employee.query.all()
    return jsonify([{
        "id": e.id,
        "login_id": e.login_id,
        "name": e.name,
        "department": e.department
    } for e in employees])
