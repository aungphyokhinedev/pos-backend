
"use strict";

const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const settings = require("../config/settings.json");
const scheduleTaskRuleModel = require("../models/schedule.task.rule.model");
const authorizationMixin = require("../mixin/authorization.mixin");
const schedule = require("node-schedule");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
module.exports = {
	name: "scheduletaskrule",
	version: 1,
	mixins: [DbService,authorizationMixin],

	adapter: new MongooseAdapter(process.env.MONGO_URI || settings.mongo_uri, { "useUnifiedTopology": true }),
	model: scheduleTaskRuleModel,

	//collection: "users",
	/**
	 * Service settings
	 */
	settings: {
		scheduler: null,
		failLimit: 5,
		populates: {
			"uid": {
				action: "v1.auth.get",
				params: {
					fields: "email _id"
				}
			},
			"task": {
				action: "v1.scheduletask.get",
				params: {
					fields: "name _id"
				}
			},
			"rule": {
				action: "v1.schedulerule.get",
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

			return "Hello Schedule Task Rule";
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
        
		this.settings.scheduler = schedule.scheduleJob("* * * * *",async function() {
			const _now = new Date();
			//sunday 0 to saturday 7
			const _weekday = _now.getDay() + 1;
			const _day = _now.getDate();
			const _year = _now.getFullYear();
			const _month = _now.getMonth() + 1;
			const _hour = _now.getHours();
            const _minute = _now.getMinutes();
           
            
			const _rules =  await this.broker.call("v1.schedulerule.find",{
				query: {
					minute: {$in: [_minute,null]},
					hour: {$in: [_hour,null]},
					weekday: {$in: [_weekday,null]},
					day: {$in: [_day,null]},
					month: {$in: [_month,null]},
					year: {$in: [_year,null]},
				}
            });

			const _ruleids = _rules.map(x=>new ObjectId(x._id));
			
			const _taskrules =  await this.broker.call("v1.scheduletaskrule.find",{
				query: {
					rule: {$in: _ruleids},
					active: true
				}
			});
			const _taskids = _taskrules.map(x=>new ObjectId(x.task));
			
			const _tasks =  await this.broker.call("v1.scheduletask.find",{
				query: {
					_id: {$in: _taskids},
					active: true
				}
			});

			for(const _task of _tasks) {
				try{
					const _params =  await this.broker.call("v1.scheduletaskparam.find",{
						query: {
							task: _task._id,
						}
					});
                    
					let _data = {};
					for(const _param of _params){
						_data[_param.name] = _param.value;
					}
                    
					await this.broker.call(_task.service,_data);
					await this.broker.call("v1.schedulelog.create",{
						date: Date.now(),
						task: _task._id,
						name: _task.name,
						done: true
					});
					
				}
				catch(e){
					await this.broker.call("v1.schedulelog.create",{
						date: Date.now(),
						task: _task._id,
						name: _task.name,
						done: false,
						errorMsg: e.message
					});
				
				}
				
			}
            
            
		}.bind(this));
        
	},

	/**
	 * Service stopped lifecycle event handler
	 */
	stopped() {
		if(this.settings.scheduler){
			this.settings.scheduler.cancel();
		}
	}
};