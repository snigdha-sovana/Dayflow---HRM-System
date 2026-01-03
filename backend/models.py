from extensions import db
from datetime import datetime

class Employee(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    login_id = db.Column(db.String(20), unique=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100), unique=True)
    mobile = db.Column(db.String(15))
    department = db.Column(db.String(100))
    position = db.Column(db.String(100))
    password = db.Column(db.String(200))

    salaries = db.relationship('Salary', backref='employee')
    attendance = db.relationship('Attendance', backref='employee')


class Salary(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey('employee.id'))
    basic = db.Column(db.Float)
    hra = db.Column(db.Float)
    allowance = db.Column(db.Float)
    lta = db.Column(db.Float)
    pf = db.Column(db.Float)
    tax = db.Column(db.Float)
    net_salary = db.Column(db.Float)


class Attendance(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey('employee.id'))
    date = db.Column(db.Date, default=datetime.utcnow)
    check_in = db.Column(db.Time)
    check_out = db.Column(db.Time)
    status = db.Column(db.String(20))
