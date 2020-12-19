
"use strict";

const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const settings = require("../config/settings.json");
const posSaleDetailModel = require("../models/pos.saledetail.model");
const authorizationMixin = require("../mixin/authorization.mixin");
const {aggregates} = require("../common/mongo.aggregate.helpers");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
module.exports = {
	name: "possaledetail",
	version: 1,
	mixins: [DbService,authorizationMixin],

	adapter: new MongooseAdapter(process.env.MONGO_URI || settings.mongo_uri, { "useUnifiedTopology": true }),
	model: posSaleDetailModel,

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
					fields: "name  _id"
				}
            },
            "sale": {
				action: "v1.possale.get",
				params: {
					fields: "name invoiceNumber  _id"
				}
            },
            "item": {
				action: "v1.positem.get",
				params: {
					fields: "name photo  _id"
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
             
				return this.saleDetailSummary(ctx);

			}
		},
		saledetailtop: {
			params: {
			},
			async handler(ctx) {
             
				return this.saleDetailTop(ctx);

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
		async saleDetailSummary(ctx) {
		
			const _group = ctx.params.group ? "$" + ctx.params.group : null;
			const _match = {
				date: {
					$gte: new Date(ctx.params.start),
					$lt: new Date(ctx.params.end),
				},
				owner:  ObjectId(ctx.params.owner)
			};
			if(ctx.params.shop) _match.shop = ObjectId(ctx.params.shop);
			if(ctx.params.customer) _match.customer = ObjectId(ctx.params.customer);
			if(ctx.params.user) _match.user = ObjectId(ctx.params.user);
			if(ctx.params.item) _match.item = ObjectId(ctx.params.item);
			
			const _data = await aggregates({
				uri:this.adapter.uri,
				collection: "possaledetails",
				match: _match,
				page: ctx.params.page,
				pageSize:ctx.params.pageSize,
				group: { _id:_group, total: { $sum: "$amount" }, count: {$sum: "$qty"} }

			});
		
			return _data;
/*
			return _data? { 
				total: _data.total? _data.total:0,
				count: _data.count? _data.count:0,
			}: {total:0, count: 0};*/
		
		},

		async saleDetailTop(ctx) {
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
				collection: "possaledetails",
				match: _match,
				//unwind: "$possaledetails",
				page: ctx.params.page,
				pageSize:ctx.params.pageSize,
				group: { _id:_group, total: { $sum: "$amount" }, count: {$sum: 1} },
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