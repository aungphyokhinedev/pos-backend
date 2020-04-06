
"use strict";

const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const settings = require("../config/settings.json");
const permissionModel = require("../models/permission.model");
const authorizationMixin = require("../mixin/authorization.mixin");
const CacheCleaner = require("../mixin/cache.cleaner.mixin");
module.exports = {
	name: "permission",
	version: 1,
	mixins: [DbService,CacheCleaner(["permission"]),authorizationMixin],

	adapter: new MongooseAdapter(process.env.MONGO_URI || settings.mongo_uri, { "useUnifiedTopology": true }),
	model: permissionModel,

	//collection: "users",
	/**
	 * Service settings
	 */
	settings: {
		failLimit: 5,
		populates: {
			"user": {
				action: "v1.auth.get",
				params: {
					fields: "email _id"
				}
			},
			"userGroup": {
				action: "v1.usergroup.get",
				params: {
					fields: "name _id"
				}
			},
			
		}
	},
	dependencies: [
		{ name: "auth", version: 1 },
		{ name: "accessrule", version: 1 },
		{ name: "usergroup", version: 1 },
		{ name: "rule", version: 1 },
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

			return "Hello Permission";
		},
		

	},
	hooks: {
		before: {
			"*": ["checkOwner"],		
		},
		after: {
		
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