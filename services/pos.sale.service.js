
"use strict";

const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const settings = require("../config/settings.json");
const posSaleModel = require("../models/pos.sale.model");
const authorizationMixin = require("../mixin/authorization.mixin");
const {aggregates} = require("../common/mongo.aggregate.helpers");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
module.exports = {
	name: "possale",
	version: 1,
	mixins: [DbService,authorizationMixin],

	adapter: new MongooseAdapter(process.env.MONGO_URI || settings.mongo_uri, { "useUnifiedTopology": true }),
	model: posSaleModel,

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
            "customer": {
				action: "v1.poscustomer.get",
				params: {
					fields: "name _id customerId"
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

			return "Hello POS Sale";
		},
		summary: {
			params: {
			},
			async handler(ctx) {
             
				return this.saleSummary(ctx);

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
		async saleSummary(ctx) {
			
			const _id = ctx.params.group ? "$" + ctx.params.group : null;
			const _match = {

				date: { 
					$gte: new Date(ctx.params.start),
					$lt: new Date(ctx.params.end),
				} ,			
				owner:  ObjectId(ctx.params.owner)
			};
			
			
			if(ctx.params.shop) _match.shop = ObjectId(ctx.params.shop);
			if(ctx.params.customer) _match.customer = ObjectId(ctx.params.customer);
			if(ctx.params.user) _match.user = ObjectId(ctx.params.user);
			console.log(_id);
			
			const _data = await aggregates({
				uri:this.adapter.uri,
				collection: "possales",
				match: _match,
				group: { _id, total: { $sum: "$total" }, count: {$sum: 1} }

			});
			return _data;
		
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