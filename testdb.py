from app import db, models

# Add user
u = models.User(UserName='Adam')
#db.session.add(u)
#db.session.commit()

# See users
users = models.User.query.all()


# Add Question
u = models.User.query.get(1)
q = models.Question(qname='Important Question',
                    quest='Who is the coolest?',
                    cora=3,
                    author=u)

# Add options
o1 = models.Options(question=q, opt='Adam')
o2 = models.Options(question=q, opt='Jason')
o3 = models.Options(question=q, opt='Nick')

db.session.add(u)
db.session.add(q)
db.session.add(o1)
db.session.add(o2)
db.session.add(o3)

db.session.commit()