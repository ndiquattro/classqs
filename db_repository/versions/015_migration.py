from sqlalchemy import *
from migrate import *


from migrate.changeset import schema
pre_meta = MetaData()
post_meta = MetaData()
asked_questions = Table('asked_questions', post_meta,
    Column('id', Integer, primary_key=True, nullable=False),
    Column('dateasked', String(length=140)),
    Column('timeasked', String(length=140)),
    Column('authorid', Integer),
    Column('roomcode', String(length=140)),
    Column('qname', String(length=140)),
    Column('quest', String(length=140)),
    Column('cora', Integer),
)


def upgrade(migrate_engine):
    # Upgrade operations go here. Don't create your own engine; bind
    # migrate_engine to your metadata
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    post_meta.tables['asked_questions'].create()


def downgrade(migrate_engine):
    # Operations to reverse the above upgrade go here.
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    post_meta.tables['asked_questions'].drop()
