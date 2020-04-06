
"use strict";
const axios = require("axios");
module.exports = {
	name: "google",
	version: 1,
	/**
	 * Service settings
	 */
	settings: {

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
			return "Hello Google";
		},
		
		login: {
			params: {
				token: "string",
			},
			async handler(ctx) {
				return await this.googleLogin(ctx.params.token);
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
		async googleLogin(token) {
			try {

				const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo",{ headers: { 'Authorization': "Bearer " +  token} });
				
				if (!response.data.sub) {
					return {
						success: false,
						message: "Google login error"
					};
				}

				return {
					success: true,
					data: {
						providerId: response.data.sub,
						email: response.data.email,
						userName: response.data.name,
						provider: "google",
						photoUrl: response.data.picture,
					}
				};
			} catch (e) {
				console.log(e);
				return {
					success: false,
					message: "Google login fail"
				};
			}
		},
	

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