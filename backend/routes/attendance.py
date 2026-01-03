from flask import Blueprint, request, jsonify
from models import Attendance
from extensions import db

attendance_bp = Blueprint("attendance", __name__)

@attendance_bp.route("/", methods=["POST"])
def mark_attendance():
    data = request.json
    record = Attendance(
        employee_id=data["employee_id"],
        check_in=data["check_in"],
        check_out=data["check_out"],
        status=data["status"]
    )
    db.session.add(record)
    db.session.commit()
    return jsonify({"message": "Attendance saved"})
