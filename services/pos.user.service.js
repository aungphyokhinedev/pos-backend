
"use strict";

const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const settings = require("../config/settings.json");
const posUserModel = require("../models/pos.user.model");
const authorizationMixin = require("../mixin/authorization.mixin");
const passwordMixin = require("../mixin/password.mixin");
module.exports = {
	name: "posuser",
	version: 1,
	mixins: [DbService,authorizationMixin,passwordMixin],

	adapter: new MongooseAdapter(process.env.MONGO_URI || settings.mongo_uri, { "useUnifiedTopology": true }),
	model: posUserModel,

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

			return "Hello POS User";
		},
		login: {
			params: {
			},
			async handler(ctx) {
				return await this.loginUser(ctx);
			}
		}

	},
	hooks: {
		before: {
			create: ["checkOwner","setPassword"],
			//update: ["checkOwner"],
			remove: ["checkOwner"]
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
		async loginUser(ctx) {
			const _user = await ctx.call("v1.posuser.get", { id: ctx.params.id });
			if(_user) {
				const _valid = await ctx.call("v1.crypto.validatePassword", { data: ctx.params.password, encrypted: _user.password });
                
				if(_valid){
					return _user;
				}
				else{
					throw "Invalid password";
				}
			}
			else{
				throw "User not found";
			}
			
		}
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