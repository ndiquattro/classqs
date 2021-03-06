from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.login import LoginManager

# Start flask
app = Flask(__name__)

# Load Conig
app.config.from_object('config')

# Connect with database
db = SQLAlchemy(app)

# Initiate LoginManager
lm = LoginManager()
lm.init_app(app)
lm.login_view = 'index'
lm.login_message = 'Please log in to access this page.'

# Import Blueprints
from .views.login import login
from .views.admin import admin
from .views.home import home
from .views.studentroom import studentroom
from .views.questionserver import questionserver

# Register Blueprints
app.register_blueprint(login)
app.register_blueprint(admin)
app.register_blueprint(home)
app.register_blueprint(studentroom)
app.register_blueprint(questionserver)

# Final import
from app import views, models
