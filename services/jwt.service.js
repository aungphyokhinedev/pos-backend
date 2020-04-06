"use strict";
const jwt = require("jsonwebtoken");
const fs = require("fs");
module.exports = {
	name: "jwt",
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
			return "Hello JWT";
		},

		signToken: {
			params: {
				data: "object",
			},
			async handler(ctx) {
				const privateKey = fs.readFileSync("./config/private.pem");
				return await jwt.sign(ctx.params.data, privateKey, { algorithm: 'RS256' });
			}
		},
		verifyToken: {
			params: {
				token: "string",
			},
			async handler(ctx) {
				const publicKey = fs.readFileSync("./config/public.pem");
				return await jwt.verify(ctx.params.token, publicKey);
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