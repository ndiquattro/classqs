from flask import render_template, url_for
from flask import Blueprint

studentroom = Blueprint('studentroom', __name__)


@studentroom.route('/roomcodepage')
def roomcodepage():

	return render_template('studentroom/roomcode.html')

@studentroom.route('/livequestionpage')
def livequestionpage():

	return render_template('studentroom/live_question_room.html')