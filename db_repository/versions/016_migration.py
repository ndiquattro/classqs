from sqlalchemy import *
from migrate import *


from migrate.changeset import schema
pre_meta = MetaData()
post_meta = MetaData()
roomcode__currques = Table('roomcode__currques', post_meta,
    Column('id', Integer, primary_key=True, nullable=False),
    Column('authorid', Integer),
    Column('roomcode', String(length=140)),
    Column('currquesid', String(length=140)),
    Column('isLive', Integer),
    Column('currarchid', Integer),
)


def upgrade(migrate_engine):
    # Upgrade operations go here. Don't create your own engine; bind
    # migrate_engine to your metadata
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    post_meta.tables['roomcode__currques'].columns['currarchid'].create()


def downgrade(migrate_engine):
    # Operations to reverse the above upgrade go here.
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    post_meta.tables['roomcode__currques'].columns['currarchid'].drop()
