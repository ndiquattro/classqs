from flask import render_template, request, jsonify
from app import app, models


@app.route('/')
@app.route('/index')
def Index():
    return render_template('index.html')


@app.route('/CreatePage')
def CreatePage():
    return render_template('CreateQuestion.html')


@app.route('/createquestion', methods=['POST'])
def createquestion():

    # Get data
    data = request.get_json(force=True)

    # Save question to database
    models.Question.add_question(data)

    return jsonify("Submitted!")
