
"use strict";

const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const settings = require("../config/settings.json");
const geolocationModel = require("../models/common.geolocation.model");
const authorizationMixin = require("../mixin/authorization.mixin");
module.exports = {
	name: "geolocation",
	version: 1,
	mixins: [DbService, authorizationMixin],

	adapter: new MongooseAdapter(process.env.MONGO_URI || settings.mongo_uri, { "useUnifiedTopology": true }),
	model: geolocationModel,

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

			return "Hello Geolocation";
		},
		search: {
			params: {
				longitude: "number",
				latitude: "number",
				distance: "number"
			},
			async handler(ctx) {
				return await ctx.call("v1.geolocation.find", {

					query: {
						location:
						{
							$near: {
								$maxDistance: ctx.params.distance,
								$geometry: {
									type: "Point",
									coordinates: [ctx.params.longitude, ctx.params.latitude]
								}
							}
						}
					}
					
				});

			}

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