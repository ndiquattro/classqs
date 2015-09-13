from app import db


# User table
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    UserName = db.Column(db.String(64), index=True)
    Question = db.relationship('Question', backref='author', lazy='dynamic')

    def __repr__(self):
        return '<User %r>' % (self.UserName)


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
            db.session.add(Options(qid=q, opt=opt))

        # Commit
        db.session.commit()

    def __repr__(self):
        return '<Quesiton %r>' % (self.quest)


class Options(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    qid = db.Column(db.Integer, db.ForeignKey('question.id'))
    opt = db.Column(db.String(140))

    def __repr__(self):
        return '<Option %r>' % (self.opt)
