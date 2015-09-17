from flask import render_template, redirect, url_for
from app import models, lm, db
from viewhelp import OAuthSignIn
from flask.ext.login import login_user, logout_user, current_user
from flask import Blueprint

login = Blueprint('login', __name__, url_prefix='/login')


# Login and authorize
@lm.user_loader
def load_user(id):
    return models.User.query.get(int(id))


@login.route('/authorize/<provider>')
def oauth_authorize(provider):
    if not current_user.is_anonymous:
        return redirect(url_for('index'))
    oauth = OAuthSignIn.get_provider(provider)
    return oauth.authorize()


@login.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('home.index'))


@login.route('/callback/<provider>')
def oauth_callback(provider):
    if not current_user.is_anonymous:
        return redirect(url_for('index'))
    oauth = OAuthSignIn.get_provider(provider)
    social_id, username, name, image = oauth.callback()
    if social_id is None:
        flash('Authentication failed.')
        return redirect(url_for('index'))
    user = models.User.query.filter_by(social_id=social_id).first()
    if not user:
        user = models.User(social_id=social_id,
                           username=username,
                           name=name,
                           imageurl=image)
        db.session.add(user)
        db.session.commit()
    login_user(user, True)
    return redirect(url_for('admin.retrievepage'))
