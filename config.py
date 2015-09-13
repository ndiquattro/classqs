import os
import yaml

# Database setup
basedir = os.path.abspath(os.path.dirname(__file__))
SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'app.db')
SQLALCHEMY_MIGRATE_REPO = os.path.join(basedir, 'db_repository')

# Login setup
with open('secrets.yaml', 'r') as f:
    secrets = yaml.load(f)

OAUTH_CREDENTIALS = {
    'facebook': {
        'id': '470154729788964',
        'secret': '010cc08bd4f51e34f3f3e684fbdea8a7'
    },
    'twitter': {
        'id': 'rour3cqeDiPtzmDtzC05bz4Ri',
        'secret': secrets['twitter']
    }
}

SECRET_KEY = secrets['cookie']
