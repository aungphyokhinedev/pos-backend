
"use strict";
const SocketIOService = require("moleculer-io");
const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const settings = require("../config/settings.json");
const accountUnitModel = require("../models/account.unit.model");
const authorizationMixin = require("../mixin/authorization.mixin");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
module.exports = {
	name: "possocket",
	version: 1,
	mixins: [SocketIOService, DbService, authorizationMixin],

	adapter: new MongooseAdapter(process.env.MONGO_URI || settings.mongo_uri, { "useUnifiedTopology": true }),
	model: accountUnitModel,

	//collection: "users",
	/**
	 * Service settings
	 */
	settings: {
		//	port: 3000,
		failLimit: 5,
		populates: {
			"uid": {
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
		hello(ctx) {


			return "Hello POS Socket IO";
		},
		
		join: {
			params: {
				room: "string",
			},
			async handler(ctx) {
				const _room = await ctx.call("v1.socketroom.find", { query: { name: ctx.params.room } });
				const _user = await ctx.call("v1.socketroomuser.find", { query: { 
					room: new ObjectId(_room[0]._id),
					user: new ObjectId(ctx.params.uid)
				} });
				if(_user.length > 0) {
					await  ctx.call("v1.socketroomuser.create",{
						room: new ObjectId(_room[0]._id),
						user: new ObjectId(ctx.params.uid),
						name: _room[0].name + "-" + ctx.params.uid,
						acceptFlag: true
					});
					// eslint-disable-next-line require-atomic-updates
					ctx.meta.$join = ctx.params.room;
					return {data:"Join [" + _room[0].name + "]"};
				}
				else{
					throw "Invalid User [" + _room[0].name + "]";
				}
			}
			
		},
		leave:{
			params: {
				room: "string",
			},
			async handler(ctx) {
				const _room = await ctx.call("v1.socketroom.find", { query: { name: ctx.params.room } });

				const _user = await ctx.call("v1.socketroomuser.find", { query: { 
					room: new ObjectId(_room[0]._id),
					user: new ObjectId(ctx.params.uid)
				} });
					
				if(_user.length > 0) {
					// eslint-disable-next-line require-atomic-updates
					ctx.meta.$join = ctx.params.room;
					await  ctx.call("v1.socketroomuser.remove",{
						id: _user[0]._id
					});
				}
				else{
					throw "Invalid User [" + _room[0].name + "]";
				}
				// eslint-disable-next-line require-atomic-updates
				ctx.meta.$leave = ctx.params.room;
				return {data:"Leave [" + _room[0].name + "]"};
			}
		},
		list(ctx) {
			return ctx.meta.$rooms;
		},
		async broadcast(ctx)  {
		
			await ctx.call("api.broadcast", {
				//		namespace:"/", //optional
				event: ctx.params.event,
				args: [ctx.params.data] , //optional
				//		volatile: true, //optional
				//		local: true, //optional
				// rooms: ctx.params.rooms //optional
			});
			return "emit sent";
		}
	},
	hooks: {
		before: {
		//	"*": ["checkOwner"],		
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

	},

	/**
	 * Service stopped lifecycle event handler
	 */
	stopped() {

	}
};