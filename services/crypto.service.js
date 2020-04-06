"use strict";
const cryptoRandomString = require("crypto-random-string");
const bcrypt = require("bcryptjs");
module.exports = {
	name: "crypto",
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
			return "Hello Crypto";
		},
		/**
		 * Generate Password
		 *
         * @param {Number} length - length
		 */
		generatePassword: {
			params: {
				length: "number"
			},
			handler(ctx) {
				return cryptoRandomString({ length: ctx.params.length });
			}

		},
		/**
		 * Hashed Password
		 *
		 * @param {String} data - data
         * @param {Number} saltRounds - saltRounds
		 */
		hashedPassword: {
			params: {
				data: "string",
				saltRounds: "number"
			},
			async handler(ctx) {
				const _salt = bcrypt.genSaltSync(ctx.params.saltRounds);
				return await bcrypt.hashSync(ctx.params.data,_salt );
			}

		},
		/**
		 * validate Password
		 *
		 * @param {String} data - data
         * @param {String} encrypted - saltRounds
		 */
		validatePassword: {
			params: {
				data: "string",
				encrypted: "string"
			},
			async handler(ctx) {
				return await bcrypt.compareSync(ctx.params.data, ctx.params.encrypted);
				
			}

		},


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