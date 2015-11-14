from flask import render_template, url_for
from flask import Blueprint
from flask.ext.login import current_user
from app.models import Roomcode_Currques, User
from admin import question_controlpanel
home = Blueprint('home', __name__)


@home.route('/')

@home.route('/index')
def index():
	
	if current_user.is_authenticated:
		logon_route = url_for('admin.retrievepage')
	else:
		logon_route = url_for('home.logon')

	return render_template('home/index.html', logon_route=logon_route)

@home.route('/logon')
def logon():

    return render_template('home/logon.html')



