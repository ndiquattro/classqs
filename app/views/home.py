from flask import render_template
from flask import Blueprint

home = Blueprint('home', __name__)


@home.route('/')
@home.route('/index')
def index():
    return render_template('home/index.html')
