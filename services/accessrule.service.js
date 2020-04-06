
"use strict";

const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const settings = require("../config/settings.json");
const accessRuleModel = require("../models/accessrule.model");
const authorizationMixin = require("../mixin/authorization.mixin");
module.exports = {
	name: "accessrule",
	version: 1,
	mixins: [DbService,authorizationMixin],

	adapter: new MongooseAdapter(process.env.MONGO_URI || settings.mongo_uri, { "useUnifiedTopology": true }),
	model: accessRuleModel,

	//collection: "users",
	/**
	 * Service settings
	 */
	settings: {
		failLimit: 5,
		populates: {
			"service": {
				action: "v1.service.get",
				params: {
					fields: "name _id"
				}
			},
			"userGroup": {
				action: "v1.usergroup.get",
				params: {
					fields: "name _id"
				}
			},
			"rule": {
				action: "v1.rule.get",
				params: {
					fields: "name _id"
				}
			},
			"application": {
				action: "v1.application.get",
				params: {
					fields: "name _id"
				}
			},
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

			return "Hello Access Rule";
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