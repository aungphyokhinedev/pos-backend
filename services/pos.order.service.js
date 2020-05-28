
"use strict";

const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const settings = require("../config/settings.json");
const posOrderModel = require("../models/pos.order.model");
const authorizationMixin = require("../mixin/authorization.mixin");
const {aggregate} = require("../common/mongo.aggregate.helpers");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
module.exports = {
	name: "posorder",
	version: 1,
	mixins: [DbService,authorizationMixin],

	adapter: new MongooseAdapter(process.env.MONGO_URI || settings.mongo_uri, { "useUnifiedTopology": true }),
	model: posOrderModel,

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
					fields: "name _id customerId" 
				}
            },
            "shop": {
				action: "v1.posshop.get",
				params: {
					fields: "name  _id"
				}
            },
            "shipping": {
				action: "v1.posshipping.get",
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

			return "Hello POS Order";
		},
		summary: {
			params: {
			},
			async handler(ctx) {
             
				return this.orderSummary(ctx);

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
		async orderSummary(ctx) {
			console.log("total order: ", ctx.params);
			const _id = ctx.params.group ? "$" + ctx.params.group : null;
			const _match = {
				date: {
					$gte: new Date(ctx.params.start),
					$lt: new Date(ctx.params.end),
				},
				owner:  ObjectId(ctx.params.owner)
			};
			if(ctx.params.shop) _match.shop = ObjectId(ctx.params.shop);
			if(ctx.params.customer) _match.shop = ObjectId(ctx.params.customer);
			
			
			const _data = await aggregate({
				uri:this.adapter.uri,
				collection: "posorders",
				match: _match,
				group: { _id, total: { $sum: "$total" }, count: {$sum: 1} }

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