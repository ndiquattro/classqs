from flask import render_template, request, jsonify, json, Blueprint, url_for, redirect
from app.models import User, Question, Options, Roomcode_Currques, asked_questions, asked_options, students_registered, class_settings
from flask.ext.login import current_user
from sqlalchemy.sql import and_
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
    resulturl = url_for('admin.resultspage', room_code=room_code, qid = "default")
    return render_template('admin/live_question_controlpanel.html', room_code = room_code, posturl=str(posturl), resulturl=resulturl)


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
    return jsonify(qname=question.qname, qtxt=question.quest, answers=ans, quid=questroom.currquesid, islive=islive, cora=question.cora, archid=questroom.currarchid)

# looks up questions and answers by roomcode
@admin.route('/lookup_by_qid')
def lookup_by_qid():
    quesid = request.args.get('quesid')
    question = Question.query.get(quesid)
    answers = Options.query.filter(Options.qid == quesid).all()
    ans = list(set([option.opt for option in answers]))
    return jsonify(qname=question.qname, qtxt=question.quest, answers=ans, cora=question.cora)

# toggle question to be live, 0 = ended, 1 = live
@admin.route('/toggle_ques_live', methods=['POST'])
def toggle_ques_live():
    data = request.get_json(force=True)
    uid = current_user.id
    Roomcode_Currques.toggle_ques_live(uid, data['islive'])
    return jsonify(response="success")

# provides route to control panel and states if it is live
@admin.route('/linkroomcode')
def linkroomcode():

    questroom = Roomcode_Currques.query.filter_by(authorid=current_user.id).first()
    roomcode = questroom.roomcode
    islive = questroom.isLive
    controlurl = url_for('admin.question_controlpanel', room_code=roomcode)
    
    return jsonify(room_url=controlurl, islive = islive)


@admin.route('/resultspage/<room_code>/<qid>')
def resultspage(room_code, qid):

    return render_template('admin/resultspage.html', room_code = room_code, qid=qid)

# generates stats for last question asked
@admin.route('/getresults') 
def getresults():
 
    room_code = request.args.get('r')
    archid = request.args.get('aid')
    print room_code
    print archid
    # if only a roomcode is supplied, just get the last question, else get the archived question
    if str(archid) == "default":
        
        qdata = Roomcode_Currques.query.filter_by(roomcode=room_code).first()
        question = asked_questions.query.get(qdata.currarchid)

    else:
        
        question = asked_questions.query.get(archid)
        
    student_answers = question.studentans.all()
    options = asked_options.query.filter_by(qid=question.id).all()

    num_options = len(options)
    num_responses = len(student_answers)
    anstxt = list(set([option.opt for option in options]))
    qtxtdata = dict(qname=question.qname, qtxt=question.quest, answers=anstxt, cora=question.cora)

    #calculate the number of correct answers
    corr_ans = question.studentans.filter_by(answered_correctly="1").all()
    num_correct = len(corr_ans)

    # calculate the number of responses for each answer option
    resultarray = []
    for i in range(0, num_options):
        totalans = 0
        for a in student_answers:
            if a.answer is i:
                totalans += 1
        resultarray.append(totalans)

    results = dict(num_options=num_options, num_ans=num_responses, num_correct=num_correct, qtxtdata = qtxtdata, resultarray=resultarray)
    return jsonify(results=results)

# Generates link to overall stats
@admin.route('/getresults_all') 
def getresults_all():
    room_code = request.args.get('r')
    questions = asked_questions.query.filter_by(roomcode=room_code).all()
    data = []

    i = 0
    for q in questions:
        quesinfo = {}
        quesinfo['archid'] = q.id
        quesinfo['dateasked'] = q.dateasked
        quesinfo['timeasked'] = q.timeasked
        quesinfo['qtxt'] = q.quest
        answers = questions[i].studentans.all()
        quesinfo['totalresponse'] = len(answers)
        correct = questions[i].studentans.filter_by(answered_correctly="1").all()
        quesinfo['numcorrect'] = len(correct)
        data.append(quesinfo)
        i+=1

    return jsonify(results=data)


# generates link to overall question stat page
@admin.route('/linkquestionstats')
def linkquestionstats():
    questroom = Roomcode_Currques.query.filter_by(authorid=current_user.id).first()
    questionstatsurl = url_for('admin.question_stats', room_code=questroom.roomcode)

    return jsonify(questionstats_url=questionstatsurl)

# link to overall question stats page
@admin.route('/question_stats/<room_code>')
def question_stats(room_code):
    resultspageurl = url_for('admin.resultspage', room_code=room_code, qid="x")

    return render_template('admin/question_stats.html', room_code =  room_code, resulturl=resultspageurl)

# generates link to gradebook page
@admin.route('/linkgradebook')
def linkgradebook():
    questroom = Roomcode_Currques.query.filter_by(authorid=current_user.id).first()
    gradebookurl = url_for('admin.gradebook', room_code=questroom.roomcode)

    return jsonify(gradebookurl_url=gradebookurl)

# link to gradebook page
@admin.route('/gradebook/<room_code>')
def gradebook(room_code):
    resultspageurl = url_for('admin.resultspage', room_code=room_code, qid="x")
 
    return render_template('admin/gradebook.html', room_code =  room_code, resultspageurl=resultspageurl)

# delete question from archive
@admin.route('/delete_q_arch', methods=['POST'])
def delete_q_arch():
    data = request.get_json(force=True)
    asked_questions.delete_asked_question(data['quid'])

    return jsonify(message="deleted question "+data['quid'])

# Get student scors for gradebook
@admin.route('/gradebook_scores') 
def gradebook_scores():
    room_code = request.args.get('r')
    current_user.id
    students = students_registered.query.filter_by(roomcode=room_code).order_by(students_registered.lastname).all()
    questions = asked_questions.query.filter(and_(asked_questions.authorid==current_user.id, asked_questions.roomcode==room_code)).all()
    studentdata = []
    questiondata = {}
  
    # get infor on questions
    for q in questions:
        qdict = {}
        qdict['qname'] = q.qname
        qdict['date'] = q.dateasked
        qdict['time'] = q.timeasked
        qdict['qtxt'] = q.quest
        questiondata[q.id] =  qdict

    #get how students answered each question
    for s in students:   
        studentdict ={}
        studentdict['sid'] = s.id
        studentdict['firstname'] = s.firstname 
        studentdict['lastname'] = s.lastname
        allanswers = s.student_answers
        answers = {}
        for a in allanswers:
            answerinfo = {}
            adict = {"answer": a.answer, "answered_correctly": a.answered_correctly}
            answerinfo[a.asked_question_id] = adict
            answers.update(answerinfo)

        studentdict['answers'] = answers
        studentdata.append(studentdict)

    return jsonify(studentdata=studentdata, questiondata=questiondata)


@admin.route('/get_roomoptions') 
def get_roomoptions():
    room_code = request.args.get('r')
    authorid = current_user.id

    roominfo = class_settings.query.filter_by(roomcode=room_code).first()

    #check if option exist, if not create defult
    if roominfo is None:
        class_settings.add_setting(authorid, room_code) 
        roominfo = class_settings.query.filter_by(roomcode=room_code).first()

    roomdata = dict(pointpart = roominfo.pointsforparticipation, pointcorr = roominfo.pointsforcorrectanswer)



    return jsonify(roomdata=roomdata)


@admin.route('/set_roomoptions') 
def set_roomoptions():
    room_code = request.args.get('r')
    authorid = current_user.id
    if request.args.get('ppart') is not None:
        result = class_settings.add_setting(authorid, room_code, pointpart = int(request.args.get('ppart')))

    if request.args.get('pcorr') is not None:
        result = class_settings.add_setting(authorid, room_code, pointcorr= int(request.args.get('pcorr')))

    return jsonify(pdata=result)









