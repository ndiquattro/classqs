from flask import render_template, request, jsonify, json, Blueprint, url_for, redirect
from flask import Blueprint
from app.models import Question, Options, Roomcode_Currques
import questionserver

studentroom = Blueprint('studentroom', __name__)


@studentroom.route('/roomcodepage')
def roomcodepage():

	return render_template('studentroom/roomcode.html')



@studentroom.route('/live_question_room.html/<room_code>')
def live_question_room(room_code):
    qservurl = url_for('questionserver.poll', room_code=room_code)
    # add to subscriptions
    questionserver.subscribe()

    return render_template('studentroom/live_question_room.html', room_code = room_code, serverurl = str(qservurl))


@studentroom.route('/lookup_room', methods=['POST'])
def lookup_room():
    data = request.get_json(force=True)
    roomcheck = Roomcode_Currques.query.filter_by(roomcode=data['roomcode']).first()
    roomexist = None
    if roomcheck is not None:
    	room_exist = "yes"
    else:
    	room_exist = "no"


    redir = url_for('studentroom.live_question_room', room_code = data['roomcode'])
    return jsonify(urlr = redir, roomcheck = room_exist)