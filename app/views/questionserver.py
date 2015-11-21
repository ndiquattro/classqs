from gevent.wsgi import WSGIServer
from gevent import monkey; monkey.patch_all()
from gevent import queue
from flask import Response, render_template, request, jsonify, json, Blueprint, url_for, redirect, Blueprint
import time
from app.models import Question, Options, Roomcode_Currques

questionserver = Blueprint('questionserver', __name__)

class Room(object):

    def __init__(self):
        self.users = set()

    def subscribe(self, user):
        self.users.add(user)

    def add(self, message):
        for user in self.users:
          
            user.queue.put_nowait(message)
       
class User(object):

    def __init__(self):
        self.queue = queue.Queue()

users = {}

roomcodes = Roomcode_Currques.query.with_entities(Roomcode_Currques.roomcode)
rooms = {}

for rcode in roomcodes:
	rooms[rcode[0]]=Room()


@questionserver.route("/event_stream/<room_code>", methods=["POST"])
def event_stream(room_code):
	
	data = request.get_json(force=True)
	msg = []

	if data['islive'] == 0:
		msg = json.dumps({'islive': 0, })

	if data['islive'] == 1:

		msg = json.dumps({'islive': 1, 'qdata' : data['qjson'] })
	
	room = rooms.get(room_code, None)
	
	if not room:
		rooms[room_code] = room = Room()

	room.add(msg)

	return jsonify(response="success")


@questionserver.route("/subscribe/<room_code>/<pass_code>")
def subscribe(room_code, pass_code):
	uid = room_code+pass_code
 	user = users.get(uid, None)
 	if not user:
		users[uid] = user = User()

	active_room = rooms[room_code]
	active_room.subscribe(user)

	return ''



@questionserver.route("/poll/<room_code>/<pass_code>")
def poll(room_code, pass_code):

	uid = room_code+pass_code
	def gen():
		try:
			msg = users[uid].queue.get_nowait()		
			msgdata = 'data: %s\n\n' % msg
			yield msgdata

		except queue.Empty:
			msgdata = ''
			yield msgdata 
	
	msg = gen()

	return Response(
		msg,
		mimetype='text/event-stream')



