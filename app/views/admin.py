from flask import render_template, request, jsonify, Blueprint
from app.models import User, Question
from flask.ext.login import current_user

# Initiate Blueprint
admin = Blueprint('admin', __name__, url_prefix='/admin')


# Create Question
@admin.route('/createpage')
def createpage():
    return render_template('admin/CreateQuestion.html')


@admin.route('/_createquestion', methods=['POST'])
def createquestion():

    # Get data
    data = request.get_json(force=True)
    data['uid'] = current_user.id  # Add current user id

    # Save question to database
    Question.add_question(data)

    return "{'Success': 'True'}"


# Display Questions
@admin.route('/retrievepage')
def retrievepage():
    return render_template('admin/QuestionSelect.html')


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
