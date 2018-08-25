import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';
import axios from 'axios';
import * as admin from 'firebase-admin';



const DEFAULT_INTENT = "welcome";
const QUIT_INTENT = "exit";
const SEND_MESSAGE = "send_message";
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


	function buildResponse(text){
		var response = {
			payload: {
				google: {
					expectUserResponse: true,
					richResponse: {
					items: [
						{
						simpleResponse: {
							textToSpeech: "Hello there!"
						}
						}
					]
					}
				}
			}
		};
		response.payload.google.items[0].simpleResponse.textToSpeech = text;
		return response;
	}

	api.post('/', (req,res )=>{
		console.log(req);

		switch(req.body.queryResult.action){
			case DEFAULT_INTENT:
					res.json(buildResponse("Hello There!"));
			break;

			case MOTHER_NUMBER:
				res.json(buildResponse("Number is set against your device!"));
			break;

			case QUIT_INTENT:
				res.json(buildResponse("Bye!"));
			break;

			case SEND_MESSAGE:
				res.json(buildResponse("Message send to your mommy"));
			break;

			default:
					res.json(buildResponse("Sorry! I couldn't get that"));
			break;
		}
	});

	return api;
}
