from flask import render_template, request, jsonify, json, Blueprint, url_for, redirect
from flask import Blueprint
from app.models import Question, Options, Roomcode_Currques, students_registered, student_answers, asked_questions
import questionserver
from flask.ext.login import current_user
from sqlalchemy.sql import and_
import time, datetime
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
    studentcheck = students_registered.query.filter(and_(students_registered.roomcode == studentinfo['roomcode'], students_registered.passcode == studentinfo['passcode'])).first()

    # if student is not registered
    if studentcheck is None:
        students_registered.add_student(studentinfo['firstname'], studentinfo['lastname'], studentinfo['roomcode'],studentinfo['passcode'])
        redir = url_for('studentroom.live_question_room', room_code = studentinfo['roomcode'], passcode=studentinfo['passcode'])
    else:
        redir = 'none'

    
    return jsonify(urlr = redir)

# checks for roomcode and passcode in db and redirects to live question page
@studentroom.route('/check_passcode', methods=['POST'])
def check_passcode():

    studentinfo = request.get_json(force=True)
    studentcheck = students_registered.query.filter(and_(students_registered.roomcode == studentinfo['roomcode'], students_registered.passcode == studentinfo['passcode'])).first()

    # if student is not registered
    if studentcheck is None:
        redir = 'none'
    else:       
        redir = url_for('studentroom.live_question_room', room_code = studentinfo['roomcode'], passcode=studentinfo['passcode'])
       

    return jsonify(urlr = redir)


@studentroom.route('/add_studentans', methods=['POST'])
def add_studentans():

    studentdata = request.get_json(force=True)
    studentcheck = students_registered.query.filter(and_(students_registered.roomcode == studentdata['roomcode'], students_registered.passcode == studentdata['passcode'])).first()
    sid = studentcheck.id
    archques = asked_questions.query.get(studentdata['archid'])
    cora = archques.cora

    if int(studentdata['answer']) == int(cora):
        a_correct = 1
    else:
        a_correct = 0
        
    #check if student has already asnwered for this quesiton, if not then create a new answer
    studentanscheck = student_answers.query.filter(and_(student_answers.studentid == sid, student_answers.asked_question_id == studentdata['archid'])).first()

    if studentanscheck is None:
        student_answers.add_studentanswer(sid, studentdata['archid'], studentdata['answer'], a_correct)

    else:
        student_answers.change_studentanswer(sid, studentdata['archid'], studentdata['answer'], a_correct)

    return jsonify(message = "Success")

@studentroom.route('/archive_asked_question', methods=['POST'])
def archive_asked_question():
    qinfo = request.get_json(force=True)
    roomcode =  qinfo['roomcode']
    qdata =  qinfo['data']
    uid = current_user.id
    date = datetime.date.today().strftime("%B %d, %Y")
    time = datetime.datetime.now().strftime("%I:%M%p")
    archid = asked_questions.add_asked_qestion(date, time, uid, roomcode, qdata['qname'], qdata['qtxt'], qdata['cora'], qdata['answers'])
    
    #add archid id to the current room so that users can get it if they didnt recieve last server push
    Roomcode_Currques.change_archiveid(qinfo['roomcode'], archid)

    qdata['archid'] =  archid

    return jsonify(qdata = qdata)
