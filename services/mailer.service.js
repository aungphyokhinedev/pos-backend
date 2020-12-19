"use strict";
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const settings = require("../config/settings.json");
module.exports = {
	name: "mailer",
	version: 1,
	/**
	 * Service settings
	 */
	settings: {
		from: "cybernetics.noreply@gmail.com",
	},

	/**
	 * Service metadata
	 */
	metadata: {

	},

	/**
	 * Service dependencies
	 */
	//dependencies: [],	

	/**
	 * Actions
	 */
	actions: {

		/**
		 * Say a 'Hello'
		 *
		 * @returns
		 */
		hello() {
			return "Hello Mailer";
		},

		/**
		 * Welcome a username
		 *
		 * @param {String} name - User name
		 */
		send: {
			params: {
				to: "string",
				subject: "string",
				html: "string"
			},
			async handler(ctx) {
				console.log("send mail");

				const oauth2Client = new OAuth2(
					settings.gmail_client_id, // ClientID
					settings.gmail_client_secret, 
					"https://developers.google.com/oauthplayground"// Client Secret
					//settings.gmail_redirect_url // Redirect URL
				);
				const _keyname = "gmail_refresh_token";
				let _refreshToken = settings.gmail_refresh_token;
			
				const _appData = await ctx.call("v1.appdata.find",{query: {name:_keyname }});
				if(_appData.length > 0) {
					_refreshToken = _appData[0].value;
				}
				else{
					console.log("no refresh token");
				}
				
				oauth2Client.on("tokens", (tokens) => {
					if (tokens.refresh_token) {
					  // store the refresh_token in my database!
					  console.log("refresh_token",tokens.refresh_token);
					  ctx.call("v1.appdata.create",{name:_keyname,value:tokens.refresh_token});
					}
					console.log("access_token",tokens.access_token);
				  });
		

				oauth2Client.setCredentials({
					refresh_token: _refreshToken
				});
				const accessToken = oauth2Client.getAccessToken();
	
				const smtpTransport = nodemailer.createTransport({
					service: "gmail",
					auth: {
						type: "OAuth2",
						user: settings.gmail_user,
						clientId: settings.gmail_client_id,
						clientSecret: settings.gmail_client_secret,
						refreshToken: settings.gmail_refresh_token,
						accessToken: accessToken
					},
					tls: {
						rejectUnauthorized: false
					  }
				});

				const mailOptions = {
					from: this.settings.from,
					to: ctx.params.to,
					subject: ctx.params.subject,
					generateTextFromHTML: true,
					html: ctx.params.html
				};


				const _send = await smtpTransport.sendMail(mailOptions);
				console.log(_send);
				return _send;
				
			}
		}
	},

	/**
	 * Events
	 */
	events: {

	},

	/**
	 * Methods
	 */
	methods: {

	},

	/**
	 * Service created lifecycle event handler
	 */
	created() {

	},

	/**
	 * Service started lifecycle event handler
	 */
	started() {

	},

	/**
	 * Service stopped lifecycle event handler
	 */
	stopped() {

	}
};