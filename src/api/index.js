import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';
import Nexmo from 'nexmo';
import axios from 'axios';
import * as admin from 'firebase-admin';
import FCM  from 'fcm-push';



const DEFAULT_INTENT = "welcome";
const QUIT_INTENT = "exit";
const ASK_LOCATION_INTENT = "ask_for_location";
const RECEIVE_LOCATION_INTENT = "receive_location";
const SEND_MESSAGE = "ReceiveLocation.ReceiveLocation-fallback";
const MOTHER_NUMBER = "mother_number";

const nexmo_api_key = "7808403f";
const nexmo_api_secret = "E7ip83joCxndITIE";
const KEY = "lYrP4vF3Uk5zgTiGGuEzQGwGIVDGuy24";
const FIREBASE_SERVER_KEY = "AAAAelN9KZg:APA91bESCJDTDIccuL2NMuT7paizbTDV5ByO1qZIlpOBf4ReujMQqF6g0BglhPuq0UYOL7PwGey0YcjXryJK0zWJ4GqqpTb-umM7ykOqD92iMQzRLnW79rY3H9jzp1pmsjLRY-N12BrNALTVlXSseQ2CAxdntLDP3Q";

admin.initializeApp({
	credential: admin.credential.cert({
	  projectId: 'mommy-i-am-lost',
	  clientEmail: 'firebase-adminsdk-nnl8b@mommy-i-am-lost.iam.gserviceaccount.com',
	  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC5jV+KK0X+SeKv\nm3Zad/zAKLPLUrxSWCq6ulIjKepTB675YRPoLK2hRAVU3dMB8zHw/SB8JUF+KNG1\nKjjFHdHufv9i8A1LGBo8GUADS7wM4hixp4NgjDGUQ0MbhV9NI29eS7XiHw/Yvq7l\nNOB5dS3VM5u//N7hVSMkkKPbB13xGY3LxmY3aNdk+HdJt1a+c7Ei08OO4VPux3ZW\nsHQBM3NDz4Ma654EEZk22CUlfSBXJwoX76/MtzNEbc3ENjLi6Ikic27POw8AMWun\nu3EsH5RAyUTf9DM9LmeO5Gneoipwdp+kmn50PTBKX7iVABtyFL7RKEqJXxiWuf0G\nYeL3CCdFAgMBAAECggEAJkmvB3iG9KIj4dcbPK9KKw+rC/9KR1aUmJvWU5W0WcY5\n25El1bCUcnSyAfFU92/KpB7jW2KnqUP8g9zOwpP06/juM2jz4UU7sp+GNzfjOahU\n7qGxiRRcraqUeCMVB3qSojtOsHZ242NzfO3kjQN6PeZsktj317jk68hh21Ihlxx0\nCscoEK9kTj51PxxK1J+ZEuVppQX5yLOU1WJWo/v7cYzU1xmzYLyaKe1ts6eMDrSk\nel1quhtnfgh+OmUnFfG1SstkKP4nbftTqxr4XecwOPT6iuVNjZ+hIvf6ZZ3y4EMz\nmmbzYU/I53foP/ga3kMMEP+LpXZOXlvE6KWsRUzaeQKBgQDggXeGMOh2whGhs3ch\ng8GsRgYLe3HU1+2q1+XtYur33sdB7dG8lnQYVPxSFUDk8hC8G8bxfboZ72vc1otk\n2cqQQRAjmUS0hCRw8hBoTU1tD8Q056x2b6UCIbCkYD8pgw1RHXByF7QDMuweg13V\nnrgnSrS2FGRo9DOXPTy/OdWzKQKBgQDTlP58TaIUFFKcGoQ5z+CgZPvvzuCACYMb\nfavErhtJgf/9JEnJ++8fou19IKI796ur0WNTjhhj0cmOjKa/1gS6k2kFZdc5VIiQ\nN9qzqtA9HpsvVJLJs1kLCq1PyG0hqde65v+I6d3mTSy9yb+jBuzDmB7whRcCVDss\nOY1Qn5oSvQKBgEZgT1eBfV28+En4OCAJbWzThpGS4NwX1Cj6BNmlaILLEytXoae8\ngigee/o/L1iViSlui66n+u6mXumbV5cFrroJq0V9hkwQIFxHhV0s3liR2K+88BMw\nbEl+xiDBCwu4STRkRht90rAuBlaKV5/fYVrv0DZDrjY4VvPR/njzaEoBAoGBALDY\nEtDgrnyr89RIEYakqnJFlZH9zwUVbkD3DC+q+mG5R7ZUs1wgt+AwdOGl+hO3UgSd\nUbDPzrD38siz5Nfo0TEE7r21PmvLrQ0lsiWDuuOrBjhMLxhpUB57gRpzQkvlwsuU\nMbdFCdRpYuEKlKN1sUVWi12rT+0BbCftvqDJlaTdAoGAaYBwkc+8OgReI/3Y8MpC\nAkZlo0SD63j1snFNCCbWNlo06ItQM4xS47AFlbPTTYfA4ogwINWOMTwoVzHRzZy3\nlHSpIPha/N2m/BiqcLFlKmoEYUawoM8DDEVJmjx/aSDry3k35WrpKr+XI2CCJDEK\njlHz62hjshysNWRsZ6qbnGs=\n-----END PRIVATE KEY-----\n",
	}),
	databaseURL: "https://mommy-i-am-lost.firebaseio.com"
  });
  var fcm = new FCM(FIREBASE_SERVER_KEY);
export default ({ config, db }) => {
	let api = Router();

	// mount the facets resource
	api.use('/facets', facets({ config, db }));

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

	api.post('/', (req,res )=>{
		console.log(req);
		console.log(req.body.queryResult.intent);

		switch(req.body.queryResult.action){
			case DEFAULT_INTENT:
			var user_id = req.body.originalDetectIntentRequest.payload.user.userId;
			admin.database().ref("/users").equalTo(user_id).on("value", function(snapshot) {
				if(snapshot.exists()){
					res.json({
						"payload": {
							"google": {
							  "expectUserResponse": true,
							  "richResponse": {
								"items": [
								  {
									"simpleResponse": {
									  "textToSpeech": "Hello"
									}
								  }
								]
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
			console.log(user_id);
			var number = {
				key : req.body.queryResult.queryText
			}
			admin.database().ref("/users").child(user_id).set(number,()=>{
				res.json({
					"payload": {
						"google": {
						  "expectUserResponse": true,
						  "richResponse": {
							"items": [
							  {
								"simpleResponse": {
								  "textToSpeech": "Number set against your device"
								}
							  }
							]
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
			case ASK_LOCATION_INTENT:
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
					})
			break;

			case RECEIVE_LOCATION_INTENT:
			//	res.json(text);

			res.json({"payload": {
				"google": {
					"expectUserResponse": true,
					"richResponse": {
					"items": [
						{
						"simpleResponse": {
							"textToSpeech": "Where are you?"
						}
						}
					]
					}
				}
			}});
			break;

			case SEND_MESSAGE:
			const nexmo = new Nexmo({
				apiKey: nexmo_api_key,
				apiSecret: nexmo_api_secret
				}, {debug: true});

	  			var latitute = req.body.originalDetectIntentRequest.payload.device.location.coordinates.latitude;

				var longitde = req.body.originalDetectIntentRequest.payload.device.location.coordinates.longitude;

//				 var latitute = "37.4219806";
//				 var longitde = "-122.0841979";

				var text  = "location : " + latitute + " " + longitde;

				var url = "https://www.mapquestapi.com/geocoding/v1/reverse?key=" + KEY+ "&location=" + latitute + "%2C" + longitde + "&outFormat=json&thumbMaps=false";
				axios.get(url).then((resp)=>{
					console.log(resp.data.results[0].locations[0].postalCode)
					text = "Zip Code: " +  resp.data.results[0].locations[0].postalCode + " he said: " + req.body.queryResult.queryText;

					var Message = {
						latitude : "" + latitute,
						longitude :"" + longitde,
						zipcode : "" + resp.data.results[0].locations[0].postalCode,
						message: "" + req.body.queryResult.queryText
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
					//console.log(admin.database().ref('/message'));
					// var fcmmessage = {
					// 	to: 'childlost', // required fill with device token or topics
					// 	collapse_key: 'your_collapse_key',
					// 	data: Message,
					// 	notification: {
					// 		title: 'Title of your push notification',
					// 		body: 'Body of your push notification'
					// 	}
					// };

					//callback style
					// fcm.send(fcmmessage, function(err, response){
					// 	if (err) {
					// 		console.log(err);
					// 		console.log("Something has gone wrong!");
					// 	} else {
					// 		console.log(response)
					// 		console.log("Successfully sent with response: ", response);


					// 	}
					// });

				// 	nexmo.message.sendSms(
				// 		'+923328287820', '+923328287820', text, { type: 'unicode' },
				// 		(err, responseData) => {
				// 			if(err) {
				// 			console.log(err);
				// 			res.json({
				// 				"payload": {
				// 					"google": {
				// 						"expectUserResponse": true,
				// 						"richResponse": {
				// 						"items": [
				// 							{
				// 							"simpleResponse": {
				// 								"textToSpeech": "Messsage sending failed"
				// 							}
				// 							}
				// 						]
				// 						}
				// 					}
				// 				}
				// 				});
				// 			} else {
				// 			const data = {
				// 				id: responseData.messages[0]['message-id'],
				// 				number: responseData.messages[0]['to']
				// 			}

				// 			// Emit to the client
				// 			res.json({
				// 				"payload": {
				// 					"google": {
				// 						"expectUserResponse": true,
				// 						"richResponse": {
				// 						"items": [
				// 							{
				// 							"simpleResponse": {
				// 								"textToSpeech": "Message send to your mommy"
				// 							}
				// 							}
				// 						]
				// 						}
				// 					}
				// 				}
				// 				});
				// 			}
				// 		});

				// }).catch((err)=>{res.json({
				// 	"payload": {
				// 		"google": {
				// 			"expectUserResponse": true,
				// 			"richResponse": {
				// 			"items": [
				// 				{
				// 				"simpleResponse": {
				// 					"textToSpeech": "Sorry I couldn't get that"
				// 				}
				// 				}
				// 			]
				// 			}
				// 		}
				// 	}
				// });
			});


			break;

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
