
"use strict";

const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const settings = require("../config/settings.json");
const posStockModel = require("../models/pos.stock.model");
const authorizationMixin = require("../mixin/authorization.mixin");
const stockupdateMixin = require("../mixin/stockupdate.mixin");
module.exports = {
	name: "posstock",
	version: 1,
	mixins: [DbService,authorizationMixin,stockupdateMixin],

	adapter: new MongooseAdapter(process.env.MONGO_URI || settings.mongo_uri, { "useUnifiedTopology": true }),
	model: posStockModel,

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
			"owner": {
				action: "v1.posowner.get",
				params: {
					fields: "name companyName _id"
				}
			},
			"shop": {
				action: "v1.posshop.get",
				params: {
					fields: "name _id"
				}
			},
			"item": {
				action: "v1.positem.get",
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

			return "Hello POS Stock";
		},
		

	},
	hooks: {
		before: {
			"*": ["checkOwner"],		
			update: ["beforeUpdatingStock"]
		},
		after: {
			create: ["onCreatedStock"],
			
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