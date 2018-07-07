import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';
import Nexmo from 'nexmo';
import axios from 'axios';

const DEFAULT_INTENT = "welcome";
const QUIT_INTENT = "exit";
const ASK_LOCATION_INTENT = "ask_for_location";
const RECEIVE_LOCATION_INTENT = "receive_location";

const nexmo_api_key = "7808403f";
const nexmo_api_secret = "E7ip83joCxndITIE";


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

		switch(req.body.queryResult.action){
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
								"DEVICE_COARSE_LOCATION	"
							]
							}
						}
						}
					}
					})
			break;

			case RECEIVE_LOCATION_INTENT:
			const nexmo = new Nexmo({
				apiKey: nexmo_api_key,
				apiSecret: nexmo_api_secret
				}, {debug: true});

	  		//var latitute = req.body.originalDetectIntentRequest.payload.device.location.coordinates.latitude;

			//	var longitde = req.body.originalDetectIntentRequest.payload.device.location.coordinates.longitude;

				 var latitute = "24.946218";
				 var longitde = "67.005615";

				var text  = "location : " + latitute + " " + longitde;
				// nexmo.message.sendSms(
				// '+923328287820', '+923328287820', text, { type: 'unicode' },
				// (err, responseData) => {
				//   if(err) {
				// 	console.log(err);
				// 	res.json({
				// 		"payload": {
				// 			"google": {
				// 			  "expectUserResponse": true,
				// 			  "richResponse": {
				// 				"items": [
				// 				  {
				// 					"simpleResponse": {
				// 					  "textToSpeech": "Messsage sending failed"
				// 					}
				// 				  }
				// 				]
				// 			  }
				// 			}
				// 		}
				// 		});
				//   } else {
				// 	console.dir(responseData);
				// 	// Get data from response
				// 	const data = {
				// 	  id: responseData.messages[0]['message-id'],
				// 	  number: responseData.messages[0]['to']
				// 	}

				// 	// Emit to the client
				// 	res.json({
				// 		"payload": {
				// 			"google": {
				// 			  "expectUserResponse": true,
				// 			  "richResponse": {
				// 				"items": [
				// 				  {
				// 					"simpleResponse": {
				// 					  "textToSpeech": "message send to your mommy"
				// 					}
				// 				  }
				// 				]
				// 			  }
				// 			}
				// 		}
				// 		});
				//   }
				//}
				//);

				res.json(text);
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
