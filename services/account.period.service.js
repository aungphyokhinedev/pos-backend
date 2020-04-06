
"use strict";

const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const settings = require("../config/settings.json");
const accountPeriodModel = require("../models/account.period.model");
const authorizationMixin = require("../mixin/authorization.mixin");
const redLock = require("../common/red.lock.helper");
const {aggregate} = require("../common/mongo.aggregate.helpers");
module.exports = {
	name: "accountperiod",
	version: 1,
	mixins: [DbService,authorizationMixin],

	adapter: new MongooseAdapter(process.env.MONGO_URI || settings.mongo_uri, { "useUnifiedTopology": true }),
	model: accountPeriodModel,

	//collection: "users",
	/**
	 * Service settings
	 */
	settings: {
		failLimit: 5
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

			return "Hello Account Period";
		},
		currentPeriod: {
			async handler(ctx) {
				let _current = await  this.adapter.find({limit:1,sort:"-date"});
				// if no period then create new one
				if(_current.length == 0){
					await  this.adapter.insert({serial: 1, name: "Initail Period"});
					_current = await  this.adapter.find({limit:1,sort:"-date"});
				}
				return _current;

			}
		},
		create: {
			async handler(ctx) {
				
				const _period = await ctx.call("v1.accountperiod.currentPeriod");
				if(_period.length == 0) throw "Invalid Period";

				redLock.retryCount = settings.lock_try_count;
				await redLock.lock(settings.account_lock, 1000).then(async(lock)=>{
					const _total = await this.getTotal(ctx,_period[0].serial);
					if(_total !== 0) throw "Transactions are not clear";

					if(_total == 0) {
						const _newSerial = _period[0].serial+1;
						return await  this.adapter.insert({serial: _newSerial, name: ctx.params.name});
					}
					return lock.unlock();
				}).catch((e)=>{
					console.log(e);
					throw "Services Busy";
				}).bind(this);
				
				
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
		async getTotal(ctx,serial) {

			const _data = await aggregate({
				uri:this.adapter.uri,
				collection: "accountpostings",
				match: { accountPeriod:serial , deleteFlag:false},
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