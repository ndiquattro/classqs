from app import db
from flask.ext.login import UserMixin


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


    def __repr__(self):
        return '<Roomcode_Currques %r>' % self.currquesid
