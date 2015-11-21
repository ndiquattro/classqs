from sqlalchemy import *
from migrate import *


from migrate.changeset import schema
pre_meta = MetaData()
post_meta = MetaData()
students = Table('students', pre_meta,
    Column('id', INTEGER, primary_key=True, nullable=False),
    Column('firstname', VARCHAR(length=140)),
    Column('lastname', VARCHAR(length=140)),
    Column('roomcode', VARCHAR(length=140)),
    Column('answer', INTEGER),
)

students__registered = Table('students__registered', post_meta,
    Column('id', Integer, primary_key=True, nullable=False),
    Column('firstname', String(length=140)),
    Column('lastname', String(length=140)),
    Column('pin', String(length=3)),
    Column('roomcode', String(length=140)),
    Column('answer', Integer),
)


def upgrade(migrate_engine):
    # Upgrade operations go here. Don't create your own engine; bind
    # migrate_engine to your metadata
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    pre_meta.tables['students'].drop()
    post_meta.tables['students__registered'].create()


def downgrade(migrate_engine):
    # Operations to reverse the above upgrade go here.
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    pre_meta.tables['students'].create()
    post_meta.tables['students__registered'].drop()
