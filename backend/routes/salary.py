from flask import Blueprint, request, jsonify
from models import Salary
from extensions import db

salary_bp = Blueprint("salary", __name__)

@salary_bp.route("/generate", methods=["POST"])
def generate_salary():
    data = request.json
    basic = data["wage"] * 0.5
    hra = basic * 0.5
    pf = basic * 0.12
    tax = 200

    net = data["wage"] + hra - pf - tax

    sal = Salary(
        employee_id=data["employee_id"],
        basic=basic,
        hra=hra,
        allowance=1000,
        lta=2000,
        pf=pf,
        tax=tax,
        net_salary=net
    )

    db.session.add(sal)
    db.session.commit()
    return jsonify({"net_salary": net})
