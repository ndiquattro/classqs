from flask import render_template, request, jsonify
from app import app

@app.route('/')
@app.route('/index')
def Index():
    return render_template('index.html')

@app.route('/CreatePage')
def CreatePage():
    return render_template('CreateQuestion.html')

@app.route('/PostCreateQuestion', methods=['POST'])
def PostCreateQuestion():
	
	
    #User and class name are just temporary values, these will change when a user login page is made
	username = "Adam"
	classname = "PSC100"

    #table name will differ in the future depending on the type of question format (pictures, checkmarks, question series, etc)
	tablename = "TxtQuestions"

	#Get data from CreateQuestion.html
	data = request.get_json(force=True)
	foldername = data['FolderName']  
	QuestionName = data['QuesName']
	NumAns = int(data['NAns'])
	QuesTxt = data['QuesTxt']
	CAnsTxt = data['CorrAns']
	Answers = data['Answers']
	return jsonify(Message="Success!")





