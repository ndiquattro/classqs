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
        return '<User %r>' % self.UserName


class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
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
