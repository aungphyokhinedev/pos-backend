
"use strict";
const axios = require("axios");

module.exports = {
	name: "facebook",
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
			return "Hello Facebook";
		},
		
		login: {
			params: {
				token: "string",
			},
			async handler(ctx) {
				return await this.facebookLogin(ctx.params.token);
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
		async facebookLogin(token) {
			try {
				const response = await axios.get("https://graph.facebook.com/me?fields=email,name&access_token=" + token);

				if (!response.data.id) {
					return {
						success: false,
						message: "Facebook login error"
					};
				}
				console.log("fbresponse",response.data);

				let photoUrl = "http://graph.facebook.com/" + response.data.id + "/picture?type=large";
				return {
					success: true,
					data: {
						providerId: response.data.id,
						email: response.data.email,
						userName: response.data.name,
						provider: "faceboook",
						photoUrl,
					}
				};
			} catch (e) {
				return {
					success: false,
					message: "Facebook login error"
				};
			}
		}

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