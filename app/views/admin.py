from flask import render_template, request, jsonify, json, Blueprint, url_for, redirect
from app.models import User, Question, Options, Roomcode_Currques
from flask.ext.login import current_user
import string, random
# Initiate Blueprint
admin = Blueprint('admin', __name__, url_prefix='/admin')


# Create Question
@admin.route('/createpage')
def createpage():
    create_route = url_for('admin.createquestion')
    userinfo_route = url_for('admin.getuserinfo')
    return render_template('admin/create_question.html', create_route = create_route, userinfo_route = userinfo_route )


@admin.route('/_createquestion', methods=['POST'])
def createquestion():
    
    # Get data
    data = request.get_json(force=True)
    data['uid'] = current_user.id  # Add current user id
    # Save question to database
    Question.add_question(data)
    redir = url_for('admin.retrievepage')
    return jsonify(urlr = redir)



# Display Questions
@admin.route('/retrievepage')
def retrievepage():
    userinfo_route = url_for('admin.getuserinfo')
    getquestions_route = url_for('admin.getquestions')
    return render_template('admin/question_select.html', userinfo_route = userinfo_route, getquestions_route = getquestions_route)


@admin.route('/_getuserinfo')
def getuserinfo():

    # User profile info
    uinfo = User.query.get(current_user.id)

    # Questions
    quests = Question.query.filter_by(authorid=current_user.id).all()
    folders = list(set([quest.folder for quest in quests]))

    return jsonify(name=uinfo.name, folders=folders, uid=uinfo.id)


@admin.route('/_getquestions')
def getquestions():

    # Get questions in folder
    folder = request.args.get('Folder')
    quests = Question.query.filter(Question.authorid == current_user.id,
                                   Question.folder == folder).all()

    # Convert to dictionary
    dqs = [{'QuestionName': quest.qname,
            'QuestionID': quest.id,
            'QuestionTXT': quest.quest,
            'Answer': quest.cora} for quest in quests]

    return jsonify(questions=dqs)

@admin.route('/question_controlpanel/<room_code>')
def question_controlpanel(room_code):
    posturl = url_for('questionserver.event_stream', room_code=room_code)
    return render_template('admin/live_question_controlpanel.html', room_code = room_code, posturl=str(posturl))


@admin.route('/add_room_currques', methods=['POST'])
def add_room_currques():

    quesid = request.get_json(force=True)
    uid = current_user.id
    # check if user already has a room
    roomcheck = Roomcode_Currques.query.filter_by(authorid=current_user.id).first()
    
    # automatically make question live whenever there is a change, might need to change this later
    islive = 1;

    # if user does not have a room then add room and question, else just change current question
    if roomcheck is None:
        roomcode = id_generator()       
        code_ques =  {'qid' : quesid['quesid'], 'rcode' : roomcode}
        Roomcode_Currques.add_room_question(code_ques, uid, islive)
    else:
        roomcode = roomcheck.roomcode
        Roomcode_Currques.change_currquestion(quesid['quesid'], uid, islive)

    redir = url_for('admin.question_controlpanel', room_code = roomcode)
    return jsonify(urlr = redir)

# generates room codes
def id_generator(size=5, chars=string.ascii_uppercase):
    return ''.join(random.choice(chars) for _ in range(size))


# looks up questions and answers by roomcode
@admin.route('/lookup_by_roomcode')
def lookup_by_roomcode():
    roomcode = request.args.get('r')
    questroom = Roomcode_Currques.query.filter_by(roomcode=roomcode).first()
    question = Question.query.get(questroom.currquesid)
    answers = Options.query.filter(Options.qid == questroom.currquesid).all()
    ans = list(set([option.opt for option in answers]))
    islive = questroom.isLive
    return jsonify(qname=question.qname, qtxt=question.quest, answers=ans, quid=questroom.currquesid, islive=islive)

# looks up questions and answers by roomcode
@admin.route('/lookup_by_qid')
def lookup_by_qid():
    quesid = request.args.get('quesid')
    question = Question.query.get(quesid)
    answers = Options.query.filter(Options.qid == quesid).all()
    ans = list(set([option.opt for option in answers]))
    return jsonify(qname=question.qname, qtxt=question.quest, answers=ans)

# toggle question to be live, 0 = ended, 1 = live
@admin.route('/toggle_ques_live', methods=['POST'])
def toggle_ques_live():
    data = request.get_json(force=True)
    uid = current_user.id
    Roomcode_Currques.toggle_ques_live(uid, data['islive'])
    return jsonify(response="success")

@admin.route('/linkroomcode')
def linkroomcode():

    questroom = Roomcode_Currques.query.filter_by(authorid=current_user.id).first()
    roomcode = questroom.roomcode
    islive = questroom.isLive
    controlurl = url_for('admin.question_controlpanel', room_code=roomcode)
    
    return jsonify(room_url=controlurl, islive = islive)