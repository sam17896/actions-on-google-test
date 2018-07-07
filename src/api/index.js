import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';
import Nexmo from 'nexmo';
import axios from 'axios';

const DEFAULT_INTENT = "welcome";
const QUIT_INTENT = "exit";
const ASK_LOCATION_INTENT = "ask_for_location";
const RECEIVE_LOCATION_INTENT = "receive_location";
const SEND_MESSAGE = "ReceiveLocation.ReceiveLocation-custom";

const nexmo_api_key = "7808403f";
const nexmo_api_secret = "E7ip83joCxndITIE";
const KEY = "lYrP4vF3Uk5zgTiGGuEzQGwGIVDGuy24";


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
			case DEFAULT_INTENT:
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
							"textToSpeech": "Sorry I couldn't get that"
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

				//  var latitute = "37.4219806";
				//  var longitde = "-122.0841979";

				var text  = "location : " + latitute + " " + longitde;

				var url = "https://www.mapquestapi.com/geocoding/v1/reverse?key=" + KEY+ "&location=" + latitute + "%2C" + longitde + "&outFormat=json&thumbMaps=false";
				axios.get(url).then((resp)=>{
					console.log(resp.data.results[0].locations[0].postalCode)
					text = "Zip Code: " +  resp.data.results[0].locations[0].postalCode;

					nexmo.message.sendSms(
						'+923328287820', '+923328287820', text, { type: 'unicode' },
						(err, responseData) => {
							if(err) {
							console.log(err);
							res.json({
								"payload": {
									"google": {
										"expectUserResponse": true,
										"richResponse": {
										"items": [
											{
											"simpleResponse": {
												"textToSpeech": "Messsage sending failed"
											}
											}
										]
										}
									}
								}
								});
							} else {
							const data = {
								id: responseData.messages[0]['message-id'],
								number: responseData.messages[0]['to']
							}

							// Emit to the client
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
							}
						});

				}).catch((err)=>{res.json({
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
