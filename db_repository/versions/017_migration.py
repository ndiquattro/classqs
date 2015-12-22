from sqlalchemy import *
from migrate import *


from migrate.changeset import schema
pre_meta = MetaData()
post_meta = MetaData()
class_settings = Table('class_settings', post_meta,
    Column('id', Integer, primary_key=True, nullable=False),
    Column('authorid', Integer),
    Column('roomcode', String(length=140)),
    Column('pointsforparticipation', Integer, default=ColumnDefault(1)),
    Column('pointsforcorrectanswer', Integer, default=ColumnDefault(1)),
)


def upgrade(migrate_engine):
    # Upgrade operations go here. Don't create your own engine; bind
    # migrate_engine to your metadata
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    post_meta.tables['class_settings'].create()


def downgrade(migrate_engine):
    # Operations to reverse the above upgrade go here.
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    post_meta.tables['class_settings'].drop()
