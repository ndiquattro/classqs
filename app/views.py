from flask import render_template, request, jsonify
from app import app, models


@app.route('/')
@app.route('/index.html')
def index():
    return render_template('index.html')


@app.route('/createpage')
def createpage():
    return render_template('CreateQuestion.html')


@app.route('/createquestion', methods=['POST'])
def createquestion():

    # Get data
    data = request.get_json(force=True)
    data['uid'] = 1  # Add fake user info
    print data
    # Save question to database
    try:
        models.Question.add_question(data)
        print 'added'
    except Exception as e:
       # print e
        pass
    return "{'good': 'good'}"
