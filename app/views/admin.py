from flask import render_template, request, jsonify
from app import app, models
from flask.ext.login import current_user


admin = Blueprint('admin', __name__, url_prefix='/admin')


# Create Question
@app.route('/createpage')
def createpage():
    return render_template('CreateQuestion.html')


@app.route('/_createquestion', methods=['POST'])
def createquestion():

    # Get data
    data = request.get_json(force=True)
    data['uid'] = current_user.id  # Add current user id

    # Save question to database
    models.Question.add_question(data)

    return "{'Success': 'True'}"


# Display Questions
@app.route('/retrievepage')
def retrievepage():
    return render_template('QuestionSelect.html')


@app.route('/_getuserinfo')
def getuserinfo():

    # User profile info
    uinfo = models.User.query.get(current_user.id)

    # Questions
    quests = models.Question.query.filter_by(authorid=current_user.id).all()
    folders = list(set([quest.folder for quest in quests]))

    return jsonify(name=uinfo.name, folders=folders, uid=uinfo.id)


@app.route('/_getquestions')
def getquestions():

    # Get questions in folder
    folder = request.args.get('Folder')
    quests = models.Question.query.filter(models.Question.authorid == current_user.id,
                                          models.Question.folder == folder).all()

    # Convert to dictionary
    dqs = [{'QuestionName': quest.qname,
            'QuestionID': quest.id,
            'QuestionTXT': quest.quest,
            'Answer': quest.cora} for quest in quests]

    return jsonify(questions=dqs)
