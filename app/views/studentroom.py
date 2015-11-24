from flask import render_template, request, jsonify, json, Blueprint, url_for, redirect
from flask import Blueprint
from app.models import Question, Options, Roomcode_Currques, Students_Registered
import questionserver
from sqlalchemy.sql import and_
import time
studentroom = Blueprint('studentroom', __name__)


@studentroom.route('/roomcodepage')
def roomcodepage():

	return render_template('studentroom/roomcode.html')



@studentroom.route('/live_question_room.html/<room_code>/<passcode>')
def live_question_room(room_code, passcode):
    qservurl = url_for('questionserver.poll', room_code=room_code, pass_code=passcode)
    # add to subscriptions
    questionserver.subscribe(room_code, passcode);

    return render_template('studentroom/live_question_room.html', room_code = room_code, serverurl = str(qservurl), pass_code = passcode)

# checks if room exists
@studentroom.route('/lookup_room', methods=['POST'])
def lookup_room():
    data = request.get_json(force=True)
    roomcheck = Roomcode_Currques.query.filter_by(roomcode=data['roomcode']).first()
    roomexist = None
    if roomcheck is not None:
    	room_exist = "yes"
    else:
    	room_exist = "no"

    return jsonify(roomcheck = room_exist)

# adds new student to the database
@studentroom.route('/add_newstudent', methods=['POST'])
def add_newstudent():

    studentinfo = request.get_json(force=True)
    redir = ''
    # check if user already has a room
    studentcheck = Students_Registered.query.filter(and_(Students_Registered.roomcode == studentinfo['roomcode'], Students_Registered.passcode == studentinfo['passcode'])).first()

    # if student is not registered
    if studentcheck is None:
        Students_Registered.add_student(studentinfo['firstname'], studentinfo['lastname'], studentinfo['roomcode'],studentinfo['passcode'])
        redir = url_for('studentroom.live_question_room', room_code = studentinfo['roomcode'], passcode=studentinfo['passcode'])
    else:
        redir = 'none'

    
    return jsonify(urlr = redir)

# checks for roomcode and passcode in db and redirects to live question page
@studentroom.route('/check_passcode', methods=['POST'])
def check_passcode():

    studentinfo = request.get_json(force=True)
    studentcheck = Students_Registered.query.filter(and_(Students_Registered.roomcode == studentinfo['roomcode'], Students_Registered.passcode == studentinfo['passcode'])).first()

    # if student is not registered
    if studentcheck is None:
        redir = 'none'
    else:       
        redir = url_for('studentroom.live_question_room', room_code = studentinfo['roomcode'], passcode=studentinfo['passcode'])
       

    return jsonify(urlr = redir)


@studentroom.route('/add_studentans', methods=['POST'])
def add_studentans():

    studentinfo = request.get_json(force=True)
    Students_Registered.add_studentanswer(studentinfo['roomcode'], studentinfo['passcode'], studentinfo['answer'])

    return jsonify(message = "Success")