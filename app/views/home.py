from flask import render_template, url_for
from flask import Blueprint

home = Blueprint('home', __name__)


@home.route('/')
@home.route('/index')
def index():
	logon_route = url_for('home.logon')
	return render_template('home/index.html', logon_route=logon_route)

@home.route('/logon')
def logon():

    return render_template('home/logon.html')

