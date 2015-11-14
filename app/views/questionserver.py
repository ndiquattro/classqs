import gevent
from gevent.wsgi import WSGIServer
from gevent import queue
from gevent.queue import Queue
from flask import Response, render_template, request, jsonify, json, Blueprint, url_for, redirect, Blueprint
import time
from app.models import Question, Options, Roomcode_Currques

questionserver = Blueprint('questionserver', __name__)

subscriptions = []


@questionserver.route("/event_stream/<room_code>", methods=["POST"])
def event_stream(room_code):
	
	data = request.get_json(force=True)
	msg = []

	if data['islive'] == 0:
		msg = json.dumps({'islive': 0})
		
	for sub in subscriptions[:]:
            sub.put_nowait(msg)

	return jsonify(response="success")


@questionserver.route("/subscribe")
def subscribe():

	q = Queue()
	subscriptions.append(q)
	
	return ''



@questionserver.route("/poll/<room_code>")
def poll(room_code):


	def gen():
		try:
			while True:
				gevent.sleep(3)
				if len(subscriptions) > 0:
					msg = subscriptions[0].get_nowait()
					print msg
					msgdata = 'data: %s\n\n' % msg
					yield msgdata
					

		except queue.Empty:
			yield "none"

	msg = gen()
	
	return Response(
            msg,
            mimetype='text/event-stream')



