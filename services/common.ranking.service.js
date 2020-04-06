
"use strict";

const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const settings = require("../config/settings.json");
const commonRankingModel = require("../models/common.ranking.model");
const authorizationMixin = require("../mixin/authorization.mixin");
const queryMixin = require("../mixin/query.mixin");
const {aggregate} = require("../common/mongo.aggregate.helpers");
module.exports = {
	name: "commonranking",
	version: 1,
	mixins: [DbService,authorizationMixin,queryMixin],

	adapter: new MongooseAdapter(process.env.MONGO_URI || settings.mongo_uri, { "useUnifiedTopology": true }),
	model: commonRankingModel,

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
			"user": {
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

			return "Hello Ranking";
		},
        total: {
			params: {
				name: "string",
			},
			async handler(ctx) {
				return this.getTotalRank(ctx);

			}
		},
		
	},
	hooks: {
		before: {
			"create": ["checkOwner"],		
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
		async getTotalRank(ctx) {
			const _data = await aggregate({
				uri:this.adapter.uri,
				collection: "rankings",
				match: { name:  ctx.params.name},
				group: { _id: null, total: { $sum: "$rank" }, count: {$sum: 1} }

            });
			return _data? { 
				total: _data.total? _data.total:0,
				count: _data.count? _data.count:0,
			}: {total:0, count: 0};
		
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