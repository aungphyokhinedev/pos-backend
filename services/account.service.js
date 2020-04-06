
"use strict";

const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const settings = require("../config/settings.json");
const accountModel = require("../models/account.model");
const authorizationMixin = require("../mixin/authorization.mixin");
const queryMixin = require("../mixin/query.mixin");
const {aggregate} =  require("../common/mongo.aggregate.helpers");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const lock = require("../common/async.lock.helper");
module.exports = {
	name: "account",
	version: 1,
	mixins: [DbService,authorizationMixin,queryMixin],

	adapter: new MongooseAdapter(process.env.MONGO_URI || settings.mongo_uri, { "useUnifiedTopology": true }),
	model: accountModel,

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
			"unit": {
				action: "v1.accountunit.get",
				params: {
					fields: "unitCode _id"
				}
			},
			"rule": {
				action: "v1.accountaccessrule.get",
				params: {
					fields: "name _id"
				}
			},
			"type": {
				action: "v1.accounttype.get",
				params: {
					fields: "typeCode name _id"
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

			return "Hello Account";
		},
		remove:{
			async handler(ctx) {
				
				return await this.adapter.updateById(ctx.params.id, {
					deleteFlag: true
				});
			}
		},
		amount: {
			params: {
				accountCode: "string",
			},
			async handler(ctx) {
				const _account = await ctx.call("v1.account.find",{query: {accountCode:ctx.params.accountCode }});
				if(_account.length == 0) throw "Invalid Account";
				return await this.getAmount(_account[0]._id);


			}
		},
		sync: {
			params: {
				accountCode: "string",
			},
			async handler(ctx) {
				const _account = await ctx.call("v1.account.find",{query: {accountCode:ctx.params.accountCode }});
				if(_account.length == 0) throw "Invalid Account";
				return	await lock.acquire(_account.accountCode,async function() {
					const _total = await this.getAmount(_account[0]._id);
					return await this.adapter.updateById(_account[0]._id, {
						amount: _total
					});
				}.bind(this));
				


			}
		},

	},
	hooks: {
		before: {
			"*": ["checkOwner"],	
			list:["hideDelete"]	
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
		async getAmount(id) {
			const _data = await aggregate({
				uri:this.adapter.uri,
				collection: "accountpostings",
				match: { account: ObjectId(id) , deleteFlag:false},
				group: { _id: "$account", total: { $sum: "$amount" } }

			});
			return _data? _data.total:0;
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