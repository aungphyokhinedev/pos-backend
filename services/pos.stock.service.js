
"use strict";

const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const settings = require("../config/settings.json");
const posStockModel = require("../models/pos.stock.model");
const authorizationMixin = require("../mixin/authorization.mixin");
module.exports = {
	name: "posstock",
	version: 1,
	mixins: [DbService,authorizationMixin],

	adapter: new MongooseAdapter(process.env.MONGO_URI || settings.mongo_uri, { "useUnifiedTopology": true }),
	model: posStockModel,

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

			return "Hello POS Stock";
		},
		create: {
			params: {
			},
			async handler(ctx) {     
               
				const _result = await this.adapter.insert(ctx.params);
		
				this.broker.emit("posstock.updated", {
					id:_result.item,
					qty:_result.qty,
					shop:_result.shop,
					item:_result.item,
					uid:ctx.params.uid,
					owner:ctx.params.owner,
					name:_result.name});
				return _result;
			}
		},
		update: {
			params: {
			},
			async handler(ctx) {    
               
                const _item = await  this.adapter.findById(ctx.params._id);
                
                console.log("_item",_item);
				let _changeQty = 0;
				if(_item){
					let _qty = ctx.params.qty ? ctx.params.qty : 0;
					if(ctx.params.deleteFlag) {
						_changeQty = _item.qty;
					}
					else{
                        console.log("change...",_item.qty);
						_changeQty = (_item.qty - _qty);
					}
				}
				_changeQty = _changeQty * -1;
				console.log("params",_changeQty);
				const _result = this.adapter.updateById(ctx.params._id, ctx.params); 
				this.broker.emit("posstock.updated", {
					id:_item.item,
					qty:_changeQty,
					shop:_item.shop,
					item:_item.item,
					uid:ctx.params.uid,
					owner:ctx.params.owner,
					name:_item.name});
				return  _result;
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