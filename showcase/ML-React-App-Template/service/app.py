from flask import Flask, request, jsonify, make_response
from flask_restplus import Api, Resource, fields
from sklearn.externals import joblib
import numpy as np
import sys

flask_app = Flask(__name__)
app = Api(app = flask_app, 
		  version = "1.0", 
		  title = "Flight Delay Predictor", 
		  description = "Predict whether a flight departure will be delayed")

name_space = app.namespace('prediction', description='Prediction APIs')

model = app.model('Prediction params', 
				  {'DAY_OF_WEEK': fields.Float(required = True, 
				  							   description="Day of the Week", 
    					  				 	   help="Day of the Week cannot be blank"),
				  'MONTH': fields.Float(required = True, 
				  							   description="Month", 
    					  				 	   help="Month cannot be blank"),
				  'BusyFactor': fields.Float(required = True, 
				  							description="Origin", 
    					  				 	help="Origin cannot be blank"),
				  'Hourofdeparture_converted': fields.Float(required = True, 
				  							description="Time Block", 
    					  				 	help="Time Block cannot be blank")})

classifier = joblib.load('classifier.joblib')

@name_space.route("/")
class MainClass(Resource):

	def options(self):
		response = make_response()
		response.headers.add("Access-Control-Allow-Origin", "*")
		response.headers.add('Access-Control-Allow-Headers', "*")
		response.headers.add('Access-Control-Allow-Methods', "*")
		return response

	@app.expect(model)		
	def post(self):
		try: 
			formData = request.json
			print(formData)
			data = [val for val in formData.values()]
			prediction = classifier.predict(np.array(data).reshape(1, -1))
			types = { 0: "ON TIME", 1: "LATE"}
			response = jsonify({
				"statusCode": 200,
				"status": "Prediction made",
				"result": "The flight will depart " + types[prediction[0]]
				})
			response.headers.add('Access-Control-Allow-Origin', '*')
			return response
		except Exception as error:
			return jsonify({
				"statusCode": 500,
				"status": "Could not make prediction",
				"error": str(error)
			})
