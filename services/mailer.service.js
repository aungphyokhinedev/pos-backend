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
		

				const oauth2Client = new OAuth2(
					settings.gmail_client_id, // ClientID
					settings.gmail_client_secret, // Client Secret
					settings.gmail_redirect_url // Redirect URL
				);

				oauth2Client.setCredentials({
					refresh_token: settings.gmail_refresh_token
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