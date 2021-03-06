
"use strict";

const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const settings = require("../config/settings.json");
const posShopUserModel = require("../models/pos.shop.user.model");
const authorizationMixin = require("../mixin/authorization.mixin");
module.exports = {
	name: "posshopuser",
	version: 1,
	mixins: [DbService,authorizationMixin],

	adapter: new MongooseAdapter(process.env.MONGO_URI || settings.mongo_uri, { "useUnifiedTopology": true }),
	model: posShopUserModel,

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
            "user": {
				action: "v1.posuser.get",
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

			return "Hello POS Shop";
		},

	},
	hooks: {
		before: {
			"*": ["checkOwner"],		
		},
		after: {
			"get": [
				async function (ctx, res) {
					removeUserInfo(res, ctx);
					return res;
				},],
			"find": [async function (ctx, res) {
				res.forEach(element => {
					removeUserInfo(element, ctx);
				});
				return res;
			},],
			"list": [async function (ctx, res) {
				res.rows.forEach(element => {
					removeUserInfo(element, ctx);
				});
				return res;
			},],
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

const removeUserInfo = function (user, ctx) {
	if (ctx.params.uid != user.uid) {
		delete user.mobile;
		delete user.email;
		delete user.locked;
		delete user.blocked;
	}
	delete user.password;

};