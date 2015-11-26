from app import db
from flask.ext.login import UserMixin
from sqlalchemy.sql import and_, func
import datetime
from sqlalchemy import Column, Integer, DateTime
from sqlalchemy.ext.declarative import declarative_base

# User table
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True)
    name = db.Column(db.String(64))
    imageurl = db.Column(db.String(256))
    social_id = db.Column(db.String(64), nullable=False, unique=True)
    Question = db.relationship('Question', backref='author', lazy='dynamic')

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        return unicode(self.id)

    def __repr__(self):
        return '<User %r>' % self.username


class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    folder = db.Column(db.String(140))
    qname = db.Column(db.String(140))
    quest = db.Column(db.String(140))
    cora = db.Column(db.Integer)
    authorid = db.Column(db.Integer, db.ForeignKey('user.id'))
    options = db.relationship('Options', backref='question', lazy='dynamic')

    @staticmethod
    def add_question(qinfo):
        # Look up user
        u = User.query.get(qinfo['uid'])

        # Add Question info
        q = Question(qname=qinfo['QuesName'],
                     quest=qinfo['QuesTxt'],
                     folder=qinfo['FolderName'],
                     cora=qinfo['CorrAns'],
                     author=u)
        db.session.add(q)

        # Create options
        for opt in qinfo['Answers']:
            db.session.add(Options(question=q, opt=opt))

        # Commit
        db.session.commit()

    def __repr__(self):
        return '<Quesiton %r>' % self.quest


class Options(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    qid = db.Column(db.Integer, db.ForeignKey('question.id'))
    opt = db.Column(db.String(140))

    def __repr__(self):
        return '<Option %r>' % self.opt

class Roomcode_Currques(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    authorid = db.Column(db.Integer, db.ForeignKey('user.id'))
    roomcode = db.Column(db.String(140))
    currquesid = db.Column(db.String(140))
    isLive = db.Column(db.Integer)
    currarchid = db.Column(db.Integer)

    @staticmethod
    def add_room_question(room_ques, uid, islive):
        
        q = Roomcode_Currques(authorid=uid,
                              roomcode=room_ques['rcode'],
                              currquesid=room_ques['qid'],
                              isLive=islive)
        db.session.add(q)
        db.session.commit()

    @staticmethod
    def change_currquestion(ques, uid, islive):
        roomcheck = Roomcode_Currques.query.filter_by(authorid=uid).first()
        roomcheck.currquesid = ques
        roomcheck.isLive = islive
        db.session.commit()

    @staticmethod
    def toggle_ques_live(uid, islive):
        roomcheck = Roomcode_Currques.query.filter_by(authorid=uid).first()
        roomcheck.isLive = islive
        db.session.commit()

    @staticmethod
    def change_archiveid(roomcode, archiveid):
        roomcheck = Roomcode_Currques.query.filter_by(roomcode=roomcode).first()
        roomcheck.currarchid = archiveid
        db.session.commit()


    def __repr__(self):
        return '<Roomcode_Currques %r>' % self.currquesid

class students_registered(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    firstname = db.Column(db.String(140))
    lastname = db.Column(db.String(140))
    roomcode = db.Column(db.String(140))
    passcode = db.Column(db.String(3))   
    student_answers = db.relationship('student_answers', backref='students_registered', lazy='dynamic')

    @staticmethod
    def add_student(firstname, lastname, roomcode, passcode):
            
        q = students_registered(firstname=firstname,
                                  lastname=lastname,
                                  roomcode=roomcode,
                                  passcode=passcode)
        db.session.add(q)
        db.session.commit()

#Stores all the students answers, use this to generate bar plots and statistics of how students answered
#and score how many students got correct total 
class student_answers(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    studentid = db.Column(db.Integer, db.ForeignKey('students_registered.id'))
    asked_question_id = db.Column(db.Integer, db.ForeignKey('asked_questions.id')) #this connects to a table of saved "asked" questions/answers
    answer = db.Column(db.Integer)
    answered_correctly = db.Column(db.Integer) # 0 = not correct, 1 = answered correctly

    @staticmethod
    def add_studentanswer(studentid, asked_question_id, answer, answered_correctly):
        
        a = student_answers(studentid=studentid,
                                  asked_question_id=asked_question_id,
                                  answer=answer,
                                  answered_correctly=answered_correctly)
        db.session.add(a)
        db.session.commit()

    @staticmethod
    def change_studentanswer(studentid, archid, answer, answered_correctly):
        studentanscheck = student_answers.query.filter(and_(student_answers.studentid == studentid, student_answers.asked_question_id == archid)).first()
        studentanscheck.answer = answer
        studentanscheck.answered_correctly = answered_correctly
        db.session.commit()

#Archives questions that have been asked, use this so the teacher can have an overview of when
#and what questions were asked, also can delete questions which would then need to delete student answers
class asked_questions(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    dateasked = db.Column(db.String(140))
    timeasked = db.Column(db.String(140))
    authorid = db.Column(db.Integer, db.ForeignKey('user.id'))
    roomcode = db.Column(db.String(140))
    qname = db.Column(db.String(140))
    quest = db.Column(db.String(140))
    cora = db.Column(db.Integer)
    options = db.relationship('asked_options', backref='asked_question', lazy='dynamic')
    studentans = db.relationship('student_answers', backref='asked_question', lazy='dynamic')

    @staticmethod
    def add_asked_qestion(dateasked, timeasked, authorid, roomcode, qname, quest, cora, answers):
        
        q = asked_questions(dateasked=dateasked,
                                timeasked = timeasked,
                                authorid=authorid,
                                roomcode=roomcode,
                                qname=qname,
                                quest=quest, 
                                cora= cora)
        db.session.add(q)
        db.session.flush()
        quid = q.id

        for opt in answers:
            db.session.add(asked_options(asked_question=q, opt=opt))

        db.session.commit()
        return quid
    
#Archives the answers for an asked question
class asked_options(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    qid = db.Column(db.Integer, db.ForeignKey('asked_questions.id'))
    opt = db.Column(db.String(140))

    

