
"use strict";

const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const settings = require("../config/settings.json");
const accountPostingModel = require("../models/account.posting.model");
const authorizationMixin = require("../mixin/authorization.mixin");
const queryMixin = require("../mixin/query.mixin");
const {aggregate} = require("../common/mongo.aggregate.helpers");
module.exports = {
	name: "accountposting",
	version: 1,
	mixins: [DbService,authorizationMixin,queryMixin],

	adapter: new MongooseAdapter(process.env.MONGO_URI || settings.mongo_uri, { "useUnifiedTopology": true }),
	model: accountPostingModel,

	//collection: "users",
	/**
	 * Service settings
	 */
	settings: {
		failLimit: 5,
		populates: {
			"account": {
				action: "v1.account.get",
				params: {
					fields: "accountCode _id name"
				}
			},
			"journal": {
				action: "v1.accountjournal.get",
				params: {
					fields: "correlationID _id"
				}
			},
			"unit": {
				action: "v1.accountunit.get",
				params: {
					fields: "unitCode _id"
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

			return "Hello Account Posting";
		},
		remove:{
			async handler(ctx) {
				return await this.adapter.updateById(ctx.params.id, {
					deleteFlag: true
				});
			}
		},
		create:{
			params: {
				journal: "string",
				account: "string",
				amount: "string",
				
			},
			async handler(ctx) {
				const _journal = await ctx.call("v1.accountjournal.get",{id:ctx.params.journal});
				if(!_journal) throw "Invalid Journal";
				const _account = await ctx.call("v1.account.get",{id:ctx.params.account});
				if(!_account) throw "Invalid Account";


				const _period = await ctx.call("v1.accountperiod.currentPeriod");
				if(_period.length == 0) throw "Invalid Period";

				return await this.adapter.insert({
					account: _account._id,
					journal: _journal._id,
					unit:  _journal.unit,
					amount: ctx.params.amount,
					uid: ctx.params.uid,
					accountPeriod: _period[0].serial,
					deleteFlag: false,
					narration: ctx.params.narration
				});
			}
		},
		total: {
			async handler(ctx) {
				const _total = this.getTotal(ctx);
				return _total;

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
		async getTotal(ctx) {
			const _period = await ctx.call("v1.accountperiod.currentPeriod");
			if(_period.length == 0) throw "Invalid Period";

			const _data = await aggregate({
				uri:this.adapter.uri,
				collection: "accountpostings",
				match: { accountPeriod: _period[0].serial , deleteFlag:false},
				group: { _id: null, total: { $sum: "$amount" } }

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