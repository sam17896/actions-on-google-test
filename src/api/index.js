import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';
import {WebhookClient} from 'dialogflow-fulfillment';
import {Permission} from 'actions-on-google';
import twilio from 'twilio';
import Nexmo from 'nexmo';


export default ({ config, db }) => {
	let api = Router();

	// mount the facets resource
	api.use('/facets', facets({ config, db }));

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

	api.post('/ask_for_location', (req,res)=>{
		// const agent = new WebhookClient({ req, res });

		// const conv =  agent.conv();

		// const options = {
		// 	context: 'To address you by name and know your location',
		// 	// Ask for more than one permission. User can authorize all or none.
		// 	permissions: ['NAME', 'DEVICE_PRECISE_LOCATION'],
		// };
		// conv.ask(new Permission(options));

		//console.log(req);
        var result = {
			"fulfillmentText": "This is a text response",
			"fulfillmentMessages": [
			  {
				"card": {
				  "title": "card title",
				  "subtitle": "card text",
				  "imageUri": "https://assistant.google.com/static/images/molecule/Molecule-Formation-stop.png",
				  "buttons": [
					{
					  "text": "button text",
					  "postback": "https://assistant.google.com/"
					}
				  ]
				}
			  }
			],
			"source": "example.com",
			"payload": {
			  "google": {
				"expectUserResponse": true,
				"richResponse": {
				  "items": [
					{
					  "simpleResponse": {
						"textToSpeech": "this is a simple response"
					  }
					}
				  ]
				}
			  },

			}
			}


		console.log(result);
		res.json(result);
	});

	api.post('/receive_location', (req,res) => {
		const ressult = JSON.stringify(req.body.originalRequest.data.device.location);
		console.log(ressult);
		//conv.add(res);
		// const client = new twilio("AC93ece7e1de3cfdb21694e980b4de8878",
		// "65645a7bddf212ffa046f9518ec16df5");

		// const twilioNumber = '+18142000866'; // your twilio phone number
		// const phoneNumber = '+923322896908';

		// /// start cloud function

		// const textMessage = {
		// 	body: `test`,
		// 	to: phoneNumber,  // Text to this number
		// 	from: twilioNumber // From a valid Twilio number
		// };

		// client.messages.create(textMessage);

		// conv.add(res, "textMessage");

	});

	api.post('/', (req,res )=>{
		console.log(req);

		switch(req.body.queryResult.action){
			case 'ask_for_location':
			res.json({
				"payload": {
				  "google": {
					"expectUserResponse": true,
					"systemIntent": {
					  "intent": "actions.intent.PERMISSION",
					  "data": {
						"@type": "type.googleapis.com/google.actions.v2.PermissionValueSpec",
						"optContext": "To deliver your order",
						"permissions": [
						  "NAME",
						  "DEVICE_PRECISE_LOCATION"
						]
					  }
					}
				  }
				}
			  })
			break;

			case 'receive_location':
			  //console.log(req.body.originalDetectIntentRequest.payload.device.location);
			//   const client = new twilio("AC93ece7e1de3cfdb21694e980b4de8878",
			//   "65645a7bddf212ffa046f9518ec16df5");

			//   const twilioNumber = '+18142000866'; // your twilio phone number
			//   const phoneNumber = '+92 332 8287820';

			//   /// start cloud function

			//   const textMessage = {
			// 	  body: "ap ka lalla gum hogya hai",
			// 	  to: phoneNumber,  // Text to this number
			// 	  from: twilioNumber // From a valid Twilio number
			//   };

			const nexmo = new Nexmo({
				apiKey: '7808403f',
				apiSecret: 'E7ip83joCxndITIE'
			  }, {debug: true});

			nexmo.message.sendSms(
				'+923328287820', '+923328287820', 'ap ka lall gum gya hai', { type: 'unicode' },
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
					console.dir(responseData);
					// Get data from response
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
									  "textToSpeech": "message send to your mommy"
									}
								  }
								]
							  }
							}
						}
						});
				  }
				}
			  );

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
							  "textToSpeech": "this is a simple response"
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
