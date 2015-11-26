from sqlalchemy import *
from migrate import *


from migrate.changeset import schema
pre_meta = MetaData()
post_meta = MetaData()
students__registered = Table('students__registered', pre_meta,
    Column('id', INTEGER, primary_key=True, nullable=False),
    Column('firstname', VARCHAR(length=140)),
    Column('lastname', VARCHAR(length=140)),
    Column('roomcode', VARCHAR(length=140)),
    Column('answer', INTEGER),
    Column('passcode', VARCHAR(length=3)),
)

asked_options = Table('asked_options', post_meta,
    Column('id', Integer, primary_key=True, nullable=False),
    Column('qid', Integer),
    Column('opt', String(length=140)),
)

asked_questions = Table('asked_questions', post_meta,
    Column('id', Integer, primary_key=True, nullable=False),
    Column('timeasked', DateTime(timezone=True)),
    Column('authorid', Integer),
    Column('roomcode', String(length=140)),
    Column('qname', String(length=140)),
    Column('quest', String(length=140)),
    Column('cora', Integer),
)

student_answers = Table('student_answers', post_meta,
    Column('id', Integer, primary_key=True, nullable=False),
    Column('studentid', Integer),
    Column('asked_question_id', Integer),
    Column('answer', Integer),
    Column('answered_correctly', Integer),
)

students_registered = Table('students_registered', post_meta,
    Column('id', Integer, primary_key=True, nullable=False),
    Column('firstname', String(length=140)),
    Column('lastname', String(length=140)),
    Column('roomcode', String(length=140)),
    Column('passcode', String(length=3)),
)


def upgrade(migrate_engine):
    # Upgrade operations go here. Don't create your own engine; bind
    # migrate_engine to your metadata
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    pre_meta.tables['students__registered'].drop()
    post_meta.tables['asked_options'].create()
    post_meta.tables['asked_questions'].create()
    post_meta.tables['student_answers'].create()
    post_meta.tables['students_registered'].create()


def downgrade(migrate_engine):
    # Operations to reverse the above upgrade go here.
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    pre_meta.tables['students__registered'].create()
    post_meta.tables['asked_options'].drop()
    post_meta.tables['asked_questions'].drop()
    post_meta.tables['student_answers'].drop()
    post_meta.tables['students_registered'].drop()
