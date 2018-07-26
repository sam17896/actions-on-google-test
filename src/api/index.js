import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';
import axios from 'axios';
import * as admin from 'firebase-admin';



const DEFAULT_INTENT = "welcome";
const QUIT_INTENT = "exit";
const SEND_MESSAGE = "send_message";
const RECEIVE_LOCATION_INTENT = "receive_location";
const MOTHER_NUMBER = "mother_number";

const KEY = "lYrP4vF3Uk5zgTiGGuEzQGwGIVDGuy24";
admin.initializeApp({
	credential: admin.credential.cert({
	  projectId: 'childsupport-22258',
	  client_email: "firebase-adminsdk-yl6nc@childsupport-22258.iam.gserviceaccount.com",
		private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCK3WFJA0/FtlSJ\nzd0Qy550bwJI80uwdCLrU5C6OftmDYXZryU5L6cXaxtEFLDeN4fbl/cajue4C9mN\nHlOWIX/x03ItS9ZfLd7xQ3YpRkL+CwNN0hHFb0sj0QJ0v7LIn0mmceJqB3y1G7VM\nNNw1xa6HXz4BBZ6zb5Ak6/LIRvYNhEDtZSzBdnTD6DjkO1pUKKwKWnrDQagCrZID\ncToa+Lp9ooKI1BvDwaQ28zVcly99GT9+iviNH85ye9lH4Luhz3Cl4mPMX/7YB2sr\n9IzGPPEAeb6DEeaWwufRpr9nJ/jV8SC8JRoNhR4KFUFKXRH8hLYdhgagLglo8gdD\nAd8PW7DnAgMBAAECggEACPmP4mkoDGOMCTADRqTyWRzHmAa+xekWTKv6TEmXuZvM\nIn/oYaQhIilWT3XK4ex9h7Aa/14XFH+85XBSqf8A8ZSJ6kA0MF3wQnBAFct9uZo6\nnMVOnWUOWoKVVw2rX2i0GOF+vFLpjhxRVls1lErHdzus7+H4xNNuty7XYnb7oMSV\nZ84nSZ+or3gKg5Lhz/pczs8CWq6PSXbtM6RbD2YQShlFKPrdjtSTTVdpv8283T/0\n8S7fu7UcbgOdtvVIYKQJByUf/W1yvfi2e4zv6zk7G0tyrOBAdaIUOZIcuhOQwIpZ\nbLxYQZYNcHGHf8owDiPzoknYTH42DRgxgtJCG9ooAQKBgQC9BXho1mAwhqWyxVwx\n8yUsZPfVFiZMa0/JmFy0YbfIwOSFgDOy0F5afDWltBOqOUG+laJda4ufYSD3q1pF\nHFuMKiE1TNfBKPNLfNsmQ5rJ11/gmonzWRK7O4QJNyCx+cv564tmzrGGTWk8VeCE\nC5YntnDL5qWzpifoGbdZCdzs5wKBgQC8EhkFcqKRQExgY7ptfU8KUsavKeYSjydj\nP8Wlq6W8PSQ3M4luRIJdqMRYUr3Ip8dVpaam3Ivvieh8hcKPObKRWTwQ/ZoUlH+J\ndOlIXJFfCPRGh24P2xRUk/rNyarLjsbjinwbCzFfYLSlPY5ks6qTbLw6Pa6e2ob/\naOMTe46cAQKBgQCKfkGU/s2HgIBTlctRRceM2YXEePAiudXB7YKvH5Ha44oMTryS\nXZ1kSvG7sU9fP4huLZDDRhMM+ct/6+q+DGL/NbcTKHREsM5iFt8zEAGPteAn3tMI\nm9DfomHBpsSr4kyTlwOSlgr4Tiu2620PErY37rKCk0IBeNJwercd494dLQKBgQCG\nU8LNUlBswGkM2443T64ZqH/CcoGitd6jE9R+fPfWWDE6wDOjr4kRjk4W65oj7DoC\noVtDiPjl8TE9Z2hMViCFkh/F3uyjUGE7c2Z/yaYHI+UdTvO8nXSK6FrVivnThDno\nIWx9AGSWRAMilrHSmUT3IU3bp1zGlzyexnKR4sk8AQKBgGxGFBMgN2AzjZtlmEhD\nuFknjVsJ+fY5AKe3j1odtO7wzVxOgkEXH6GhnG1PzfoiF2nszTtcfdEdwc2sINyf\n3BTslZTdslBQVL/RUIXEPujmncOiFIWVO/fben4yM6bKfIXj3GnCIUCuHomjbbZx\nJ7CfPPagVNGg3lJ/JB9nAvS+\n-----END PRIVATE KEY-----\n",
	}),
	databaseURL: "https://childsupport-22258.firebaseio.com/"
  });

export default ({ config, db }) => {
	let api = Router();

	// mount the facets resource
	api.use('/facets', facets({ config, db }));

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

	api.post('/', (req,res )=>{

		switch(req.body.queryResult.action){
			case DEFAULT_INTENT:
			var user_id = req.body.originalDetectIntentRequest.payload.user.userId;
			admin.database().ref("/users/" + user_id).once("value", function(snapshot) {
				if(snapshot.exists()){
					res.json({
						"payload": {
							"google": {
							"expectUserResponse": true,
							"systemIntent": {
								"intent": "actions.intent.PERMISSION",
								"data": {
								"@type": "type.googleapis.com/google.actions.v2.PermissionValueSpec",
								"optContext": "To inform your mummy",
								"permissions": [
									"NAME",
									"DEVICE_PRECISE_LOCATION",
									"DEVICE_COARSE_LOCATION"
								]
								}
							}
							}
						}
						});
				} else {
					res.json({
						"payload": {
							"google": {
							  "expectUserResponse": true,
							  "richResponse": {
								"items": [
								  {
									"simpleResponse": {
									  "textToSpeech": "Please enter your mother's number!"
									}
								  }
								]
							  }
							}
						}
					});
				}
			});
			break;

			case MOTHER_NUMBER:

			var user_id = req.body.originalDetectIntentRequest.payload.user.userId;
			var number = {
				key : req.body.queryResult.queryText
			}
			admin.database().ref("/users").child(user_id).set(number,()=>{
				res.json({
					"payload": {
						"google": {
						"expectUserResponse": true,
						"systemIntent": {
							"intent": "actions.intent.PERMISSION",
							"data": {
							"@type": "type.googleapis.com/google.actions.v2.PermissionValueSpec",
							"optContext": "To inform your mummy",
							"permissions": [
								"NAME",
								"DEVICE_PRECISE_LOCATION",
								"DEVICE_COARSE_LOCATION"
							]
							}
						}
						}
					}
					});
			});

			break;

			case QUIT_INTENT:
			res.json({
				"payload": {
					"google": {
					  "expectUserResponse": true,
					  "richResponse": {
						"items": [
						  {
							"simpleResponse": {
							  "textToSpeech": "Bye"
							}
						  }
						]
					  }
					}
				}
			});
			break;
			case RECEIVE_LOCATION_INTENT:
				res.json({
					"payload": {
						"google": {
							"expectUserResponse": true,
							"richResponse": {
							"items": [
								{
								"simpleResponse": {
									"textToSpeech": "Permission granted!"
								}
								}
							]
							}
						}
					}
					})
			break;

			case SEND_MESSAGE:
			//	res.json(text);

				var latitute = req.body.originalDetectIntentRequest.payload.device.location.coordinates.latitude;

				var longitde = req.body.originalDetectIntentRequest.payload.device.location.coordinates.longitude;


				var url = "https://www.mapquestapi.com/geocoding/v1/reverse?key=" + KEY+ "&location=" + latitute + "%2C" + longitde + "&outFormat=json&thumbMaps=false";
				axios.get(url).then((resp)=>{
					admin.database().ref('/users/' +req.body.originalDetectIntentRequest.payload.user.userId)
					.on("value", function(snapshot){
						var number = snapshot.val().key;
						var Message = {
							latitude : "" + latitute,
							longitude :"" + longitde,
							zipcode : "" + resp.data.results[0].locations[0].postalCode,
							to: "" + number
						}

						admin.database().ref('/message').set(Message);
						var topic = 'childlost';
						var fcmmessage = {
							data: Message,
							topic: topic
							};

						  admin.messaging().send(fcmmessage)
							.then((response) => {
								// Response is a message ID string.
								res.json({
									"payload": {
										"google": {
											"expectUserResponse": true,
											"richResponse": {
											"items": [
												{
												"simpleResponse": {
													"textToSpeech": "Message send to your mommy"
												}
												}
											]
											}
										}
									}
									});
								console.log('Successfully sent message:', response);
							})
							.catch((error) => {
								console.log('Error sending message:', error);
							});
				});


					});


			// res.json({"payload": {
			// 	"google": {
			// 		"expectUserResponse": true,
			// 		"richResponse": {
			// 		"items": [
			// 			{
			// 			"simpleResponse": {
			// 				"textToSpeech": "Where are you?"
			// 			}
			// 			}
			// 		]
			// 		}
			// 	}
			// }});
			break;

			// case SEND_MESSAGE:
			// 	var latitute = req.body.originalDetectIntentRequest.payload.device.location.coordinates.latitude;

			// 	var longitde = req.body.originalDetectIntentRequest.payload.device.location.coordinates.longitude;


			// 	var url = "https://www.mapquestapi.com/geocoding/v1/reverse?key=" + KEY+ "&location=" + latitute + "%2C" + longitde + "&outFormat=json&thumbMaps=false";
			// 	axios.get(url).then((resp)=>{
			// 		admin.database().ref('/users/' +req.body.originalDetectIntentRequest.payload.user.userId)
			// 		.on("value", function(snapshot){
			// 			var number = snapshot.val().key;
			// 			var Message = {
			// 				latitude : "" + latitute,
			// 				longitude :"" + longitde,
			// 				zipcode : "" + resp.data.results[0].locations[0].postalCode,
			// 				message: "" + req.body.queryResult.queryText,
			// 				to: "" + number
			// 			}

			// 			admin.database().ref('/message').set(Message);
			// 			var topic = 'childlost';
			// 			var fcmmessage = {
			// 				data: Message,
			// 				topic: topic
			// 				};

			// 			  admin.messaging().send(fcmmessage)
			// 				.then((response) => {
			// 					// Response is a message ID string.
			// 					res.json({
			// 						"payload": {
			// 							"google": {
			// 								"expectUserResponse": true,
			// 								"richResponse": {
			// 								"items": [
			// 									{
			// 									"simpleResponse": {
			// 										"textToSpeech": "Message send to your mommy"
			// 									}
			// 									}
			// 								]
			// 								}
			// 							}
			// 						}
			// 						});
			// 					console.log('Successfully sent message:', response);
			// 				})
			// 				.catch((error) => {
			// 					console.log('Error sending message:', error);
			// 				});
			// 	});


			// 		});

			// break;

			default:
					res.json({
						"payload": {
							"google": {
								"expectUserResponse": true,
								"richResponse": {
								"items": [
									{
									"simpleResponse": {
										"textToSpeech": "Sorry I couldn't get that"
									}
									}
								]
								}
							}
						}
					});
			break;
		}
	});

	return api;
}
