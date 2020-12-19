
"use strict";

const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const settings = require("../config/settings.json");
const posShopStockModel = require("../models/pos.shopstock.model");
const authorizationMixin = require("../mixin/authorization.mixin");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
module.exports = {
	name: "posshopstock",
	version: 1,
	mixins: [DbService,authorizationMixin],

	adapter: new MongooseAdapter(process.env.MONGO_URI || settings.mongo_uri, { "useUnifiedTopology": true }),
	model: posShopStockModel,

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
			"item": {
				action: "v1.positem.get",
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

			return "Hello POS Shop Stock";
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
		async "posstock.updated" (params)  {
			
			let _current = await this.adapter.find({query:{
				shop:params.shop,
				item:params.item,
			}});
		
			if(_current.length == 0){
				this.adapter.insert({
					uid:params.uid,
					owner:params.owner,
					name:params.name,
					shop:params.shop,
					item:params.item,
					deleteFlag: false,
					qty: params.qty
				}); 
				
			}
			else{
				
				let result = await this.adapter.updateById(ObjectId(_current[0]._id), {
					qty: params.qty + _current[0].qty
				}); 
				console.log("update result",result);
			}
		},
		async "posstock.sale" (params)  {
			
			let _current = await this.adapter.find({query:{
				shop:params.shop,
				item:params.item,
			}});

		
			if(_current.length > 0) {
				await this.adapter.updateById(_current[0]._id, {
					qty: _current[0].qty - params.qty
				}); 
			
			}
			
		}
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