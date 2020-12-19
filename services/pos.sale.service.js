
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
					fields: "name  _id address mobile"
				}
			},
			"user": {
				action: "v1.posuser.get",
				params: {
					fields: "name  _id fullName"
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
		saletop: {
			params: {
			},
			async handler(ctx) {
             
				return this.saleTop(ctx);

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
		//	console.log("ctx",ctx.params);
			const _group = ctx.params.group ? "$" + ctx.params.group : null;
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
			
			
			const _data = await aggregates({
				uri:this.adapter.uri,
				collection: "possales",
				match: _match,
				page: ctx.params.page,
				pageSize:ctx.params.pageSize,
				group: { _id:_group, total: { $sum: "$total" }, count: {$sum: 1} }

			});
			console.log("datata",_data);
			return _data;
		
		},
		async saleTop(ctx) {
			//	console.log("ctx",ctx.params);
			const _group = ctx.params.group ? "$" + ctx.params.group : null;
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
				
		
			const _data = await aggregates({
				uri:this.adapter.uri,
				collection: "possales",
				match: _match,
				//unwind: "$possales",
				page: ctx.params.page,
				pageSize:ctx.params.pageSize,
				group: { _id:_group, total: { $sum: "$total" }, count: {$sum: 1} },
				sort : { "total": -1 } 
	
			});
				//console.log("datata",_data);
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