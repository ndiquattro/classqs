
# This is the CreateQuestion app
# This gets the POST command from CreateQuestion.html and then stores it in a SQL database
# This is just an example that has all the correct headers from the CreateQuestion.html
# The MySQL will need to be changed to our database, so right not it is not working

from flask import Flask, request
from flask.ext.mysql import MySQL

app = Flask(__name__)

mysql = MySQL()

# MySQL configurations
app.config['MYSQL_DATABASE_USER'] = 'acor07'
app.config['MYSQL_DATABASE_PASSWORD'] = '2757belmont'
app.config['MYSQL_DATABASE_DB'] = 'my_classquestions'
app.config['MYSQL_DATABASE_HOST'] = 'acor07.mysql.pythonanywhere-services.com'
mysql.init_app(app)


@app.route('/CreateQuestion', methods=['POST'])
def SaveQuestion():

    AnsTxt = []
    AnsHead = []

    #User and class name are just temporary values, these will change when a user login page is made
    username = "Adam"
    classname = "PSC100"

    #table name will differ in the future depending on the type of question format (pictures, checkmarks, question series, etc)
    tablename = "TxtQuestions"


    foldername = request.form['TableName']  #this is not a table name, its the folder name for user
    QuestionName = request.form['QuesName']
    NumAns = int(request.form['NAns'])
    QuesTxt = request.form['QuesTxt']
    CAnsTxt = request.form['CorrAns']

    for x in range(0, NumAns):
        AnsStrVar = "Ans" + str(x+1)
        AnsStrStr = "Answer" + str(x+1)
        AnsTxt.append(request.form[AnsStrVar])
        AnsHead.append(AnsStrStr)

    conn = mysql.connect()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO %s (UserName, ClassName, FolderName, QuestionName, NumAnswers, QuestionTxt , CorrectAns) VALUES (%s, %s, %s, %s, %s, %s, %s)", (tablename, username, classname, foldername, QuestionName, NumAns, QuesTxt, CAnsTxt))
    conn.commit()
    conn.close()
    return "Success!"



