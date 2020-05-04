
"use strict";

const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const settings = require("../config/settings.json");
const poskingModel = require("../models/pos.ranking.model");
const authorizationMixin = require("../mixin/authorization.mixin");
const queryMixin = require("../mixin/query.mixin");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const {aggregate} = require("../common/mongo.aggregate.helpers");
module.exports = {
	name: "posranking",
	version: 1,
	mixins: [DbService,authorizationMixin,queryMixin],

	adapter: new MongooseAdapter(process.env.MONGO_URI || settings.mongo_uri, { "useUnifiedTopology": true }),
	model: poskingModel,

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
			"customer": {
				action: "v1.poscustomer.get",
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

			return "Hello POS Ranking";
		},
        total: {
			params: {
			},
			async handler(ctx) {
             
				return this.getTotalRank(ctx);

			}
		},
		
	},
	hooks: {
		before: {
			
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
            console.log("tatoal an", ctx.params);
			const _data = await aggregate({
				uri:this.adapter.uri,
				collection: "posrankings",
				match: { transactionID:  ObjectId(ctx.params.transactionID), type: ctx.params.type},
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