from sqlalchemy import *
from migrate import *


from migrate.changeset import schema
pre_meta = MetaData()
post_meta = MetaData()
options = Table('options', post_meta,
    Column('id', Integer, primary_key=True, nullable=False),
    Column('opt', String(length=140)),
)

question = Table('question', post_meta,
    Column('id', Integer, primary_key=True, nullable=False),
    Column('qname', String(length=140)),
    Column('quest', String(length=140)),
    Column('cora', Integer),
    Column('author', Integer),
)


def upgrade(migrate_engine):
    # Upgrade operations go here. Don't create your own engine; bind
    # migrate_engine to your metadata
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    post_meta.tables['options'].create()
    post_meta.tables['question'].create()


def downgrade(migrate_engine):
    # Operations to reverse the above upgrade go here.
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    post_meta.tables['options'].drop()
    post_meta.tables['question'].drop()
