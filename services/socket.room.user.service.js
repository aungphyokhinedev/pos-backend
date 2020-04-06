
"use strict";

const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const settings = require("../config/settings.json");
const socketRoomUserModel = require("../models/socket.room.user.model");
const authorizationMixin = require("../mixin/authorization.mixin");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
module.exports = {
	name: "socketroomuser",
	version: 1,
	mixins: [DbService,authorizationMixin],

	adapter: new MongooseAdapter(process.env.MONGO_URI || settings.mongo_uri, { "useUnifiedTopology": true }),
	model: socketRoomUserModel,

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
			"user": {
				action: "v1.auth.get",
				params: {
					fields: "email _id"
				}
			},
			"room": {
				action: "v1.socketroom.get",
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

			return "Hello Socket Room User";
		},
		invite: {
			params: {
				room: "string",
				user: "string",
				name: "string"
			},
			async handler(ctx) {
				const _room = await ctx.call("v1.socketroom.find", { query: { name: ctx.params.room } });
				const _user = await ctx.call("v1.auth.find", { query: { email: ctx.params.user } });
                //check owner 
				if(_room[0].uid != ctx.params.uid){
					throw "No Permission on [" + _room[0].name + "]";
				}
                
				if(_room.length > 0 && _user.length > 0) {
					return await  ctx.call("v1.socketroomuser.create",{
						room: new ObjectId(_room[0]._id),
						user: new ObjectId(_user[0]._id),
						name: ctx.params.name,
						inviteFlag: true
					});
				}
				else{
					throw "Invalid User [" + _room[0].name + "]";
				}
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