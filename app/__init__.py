from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.login import LoginManager
from .views.login import login
from .views.admin import admin


# Start flask
app = Flask(__name__)

# Load Conig
app.config.from_object('config')

# Register Blueprints
app.register_blueprint(login)
app.register_blueprint(admin)

# Connect with database
db = SQLAlchemy(app)

# Initiate loginmanter
lm = LoginManager()
lm.init_app(app)
lm.login_view = 'index'
lm.login_message = 'Please log in to access this page.'

# Final import
from app import views, models
