from flask import render_template, request, redirect, url_for, jsonify
from app import app, models, lm, db
from oauth import OAuthSignIn
from flask.ext.login import login_user, logout_user, current_user


@app.route('/')
@app.route('/index.html')
def index():
    return render_template('index.html')


# Login and authorize
@lm.user_loader
def load_user(id):
    return models.User.query.get(int(id))


@app.route('/authorize/<provider>')
def oauth_authorize(provider):
    if not current_user.is_anonymous:
        return redirect(url_for('index'))
    oauth = OAuthSignIn.get_provider(provider)
    return oauth.authorize()


@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('index'))


@app.route('/callback/<provider>')
def oauth_callback(provider):
    if not current_user.is_anonymous:
        return redirect(url_for('index'))
    oauth = OAuthSignIn.get_provider(provider)
    social_id, username, name, image = oauth.callback()
    if social_id is None:
        flash('Authentication failed.')
        return redirect(url_for('index'))
    user = models.User.query.filter_by(social_id=social_id).first()
    if not user:
        user = models.User(social_id=social_id,
                           username=username,
                           name=name,
                           imageurl=image)
        db.session.add(user)
        db.session.commit()
    login_user(user, True)
    return redirect(url_for('index'))


# Questions
@app.route('/createpage')
def createpage():
    return render_template('CreateQuestion.html')


@app.route('/createquestion', methods=['POST'])
def createquestion():

    # Get data
    data = request.get_json(force=True)
    data['uid'] = current_user.id  # Add current user id

    # Save question to database
    models.Question.add_question(data)

    return render_template('QuestionSelect.html')


# Retrieve Questions
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
