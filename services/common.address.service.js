
"use strict";

const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const settings = require("../config/settings.json");
const addressModel = require("../models/common.address.model");
const authorizationMixin = require("../mixin/authorization.mixin");
module.exports = {
	name: "address",
	version: 1,
	mixins: [DbService,authorizationMixin],

	adapter: new MongooseAdapter(process.env.MONGO_URI || settings.mongo_uri, { "useUnifiedTopology": true }),
	model: addressModel,

	//collection: "users",
	/**
	 * Service settings
	 */
	settings: {
		failLimit: 5,
		populates: {
			"uid": {
				action: "v1.auth.get",
				params: {
					fields: "email _id"
				}
			},
			"geolocation": {
				action: "v1.geolocation.get",
				params: {
					fields: "name _id"
				}
			},
			"state": {
				action: "v1.code.get",
				params: {
					fields: "name commonCode _id"
				}
			},
			"city": {
				action: "v1.code.get",
				params: {
					fields: "name commonCode _id"
				}
			},
			"country": {
				action: "v1.code.get",
				params: {
					fields: "name commonCode _id"
				}
			}
			
		}
	},
	dependencies: [
	],

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
		hello() {

			return "Hello Address";
		},

	},
	hooks: {
		before: {
			"*": ["checkOwner"],		
		},
		after: {
			
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