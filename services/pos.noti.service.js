
"use strict";

const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const settings = require("../config/settings.json");
const posNotiModel = require("../models/pos.noti.model");
const authorizationMixin = require("../mixin/authorization.mixin");
module.exports = {
	name: "posnoti",
	version: 1,
	mixins: [DbService,authorizationMixin],

	adapter: new MongooseAdapter(process.env.MONGO_URI || settings.mongo_uri, { "useUnifiedTopology": true }),
	model: posNotiModel,

	//collection: "users",
	/**
	 * Service settings
	 */
	settings: {
		failLimit: 5,
		populates: {
            "owner": {
				action: "v1.posowner.get",
				params: {
					fields: "name _id"
				}
            },
            "customer": {
				action: "v1.poscustomer.get",
				params: {
					fields: "name _id"
				}
            },
            "shop": {
				action: "v1.posshop.get",
				params: {
					fields: "name  _id"
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

			return "Hello POS Noti";
		},

	},
	hooks: {
		before: {
		//	"*": ["checkOwner"],		
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