import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';
import {WebhookClient} from 'dialogflow-fulfillment';
import {Permission} from 'actions-on-google';


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

		console.log(req);
        var result = {
		"speech": "this text is spoken out loud if the platform supports voice interactions",
		"displayText": "this text is displayed visually",
		"messages": {
		  "type": 1,
		  "title": "card title",
		  "subtitle": "card text",
		  "imageUrl": "https://assistant.google.com/static/images/molecule/Molecule-Formation-stop.png"
		},
		"data": {
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
		  "facebook": {
			"text": "Hello, Facebook!"
		  },
		  "slack": {
			"text": "This is a text response for Slack."
		  }
		},
		"contextOut": [
		  {
			"name": "context name",
			"lifespan": 5,
			"parameters": {
			  "param": "param value"
			}
		  }
		],
		"source": "example.com",
		"followupEvent": {
		  "name": "event name",
		  "parameters": {
			"param": "param value"
		  }
		}
	  };

		console.log(result);
		res.send(result);
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

	return api;
}
