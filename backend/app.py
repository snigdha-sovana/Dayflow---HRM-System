from flask import Flask
from config import Config
from extensions import db
from flask_migrate import Migrate
from flask_cors import CORS

from routes.auth import auth_bp
from routes.employees import employee_bp
from routes.attendance import attendance_bp
from routes.salary import salary_bp

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
migrate = Migrate(app, db)
CORS(app, supports_credentials=True)


app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(employee_bp, url_prefix="/api/employees")
app.register_blueprint(attendance_bp, url_prefix="/api/attendance")
app.register_blueprint(salary_bp, url_prefix="/api/salary")

if __name__ == "__main__":
    app.run(debug=True)
