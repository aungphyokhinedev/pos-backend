
"use strict";
const authorizationMixin = require("../mixin/authorization.mixin");
const passwordMixin = require("../mixin/password.mixin");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const allowPublicCollection = ["posowner","poscurrency","poscustomer"];
module.exports = {
	name: "posadmin",
	version: 1,
	mixins: [authorizationMixin,passwordMixin],
	settings: {
		failLimit: 5,
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
			return "Hello POS Admin";
		},
		getaccount: {
			params: {
			},
			async handler(ctx) {
				return await this.getAccount(ctx);
			}
		},
		updateaccount: {
			params: {
			},
			async handler(ctx) {
				
				return await this.updateAccount(ctx);
			}
		},
		getowner: {
			params: {
			},
			async handler(ctx) {
				console.log(ctx.params);
				return await this.getOwner(ctx);
			}
		},
		
		addowner: {
			params: {
			},
			async handler(ctx) {
				
				ctx.params.owner = ctx.params.uid;
				return await this.addOwner(ctx);
			}
		},
		updateowner: {
			params: {
			},
			async handler(ctx) {
				return await this.updateOwner(ctx);
			}
		},
		getbyid: {
			params: {
			},
			async handler(ctx) {
				const _owner = await this.getOwner(ctx);
				// eslint-disable-next-line require-atomic-updates
				ctx.params.owner = _owner._id;
				return await this.getByID(ctx);
			}
		},
		mapitems: {
			params: {
			},
			async handler(ctx) {
				//const _owner = await this.getOwner(ctx);
				// eslint-disable-next-line require-atomic-updates
				//ctx.params.query.owner = _owner._id;
				return await this.mapItems(ctx);
			}
		},
		getitems: {
			params: {
			},
			async handler(ctx) {
				if(ctx.params.public){
				   const _notvalid = allowPublicCollection.indexOf(ctx.params.collection.toLowerCase()) < 0;
				   if(_notvalid) throw "Permission not allow";
				}
				else{
					const _owner = await this.getOwner(ctx);
					// eslint-disable-next-line require-atomic-updates
					ctx.params.query.owner = _owner._id;
				}
				
				return await this.getItems(ctx);
			}
		},
		additem: {
			params: {
			},
			async handler(ctx) {
				const _owner = await this.getOwner(ctx);
				// eslint-disable-next-line require-atomic-updates
				ctx.params.owner = _owner._id;
				return await this.addItem(ctx);
			}
		},
		updateitem: {
			params: {
			},
			async handler(ctx) {
				const _owner = await this.getOwner(ctx);
				// eslint-disable-next-line require-atomic-updates
				ctx.params.owner = _owner._id;
				return await this.updateItem(ctx);
			}
		},
		salesummary: {
			params: {
			},
			async handler(ctx) {
				const _owner = await this.getOwner(ctx);
				// eslint-disable-next-line require-atomic-updates
				ctx.params.owner = _owner._id;
				return await this.saleSummary(ctx);
			}
		},
		saledetailsummary: {
			params: {
			},
			async handler(ctx) {
				const _owner = await this.getOwner(ctx);
				// eslint-disable-next-line require-atomic-updates
				ctx.params.owner = _owner._id;
				return await this.saleDetailSummary(ctx);
			}
		},
		ordersummary: {
			params: {
			},
			async handler(ctx) {
				return await this.orderSummary(ctx);
			}
		},
	},
	hooks: {
		before: {
			"*": ["checkOwner"],		
		},
		after: {
			after: {
				"*": ["deletePassword"],
			}
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
		async getAccount(ctx) {
			const _account = await ctx.call("v1.auth.get", {
				id: ctx.params.uid
			});
			return _account;
		},
		async updateAccount(ctx) {
			let _data = {
				_id:ctx.params.uid
			};
			if(ctx.params.photoUrl) {
				_data.photoUrl = ctx.params.photoUrl;
			}
			if(ctx.params.userName) {
				_data.userName = ctx.params.userName;
			}
			console.log("_data",_data);
			const _result = await ctx.call("v1.auth.update",  
			_data);
			return _result;
		},
		async getOwner(ctx) {
			
			const _owner = await ctx.call("v1.posowner.find", {
			  populate:"currency",	query: { owner: ObjectId(ctx.params.uid) } 
			});
			if(_owner) {
				return _owner[0];
			}
			else{
				throw "Owner not found";
			}
			
		},

		async addOwner(ctx) {
			const _result = await ctx.call("v1.posowner.create",  
				ctx.params);
			return _result;
		},
		async updateOwner(ctx) {
			const _result = await ctx.call("v1.posowner.update",  
				ctx.params);
			return _result;
		},
		async getByID(ctx ) {
			const _collection = ctx.params.collection;
			return await ctx.call("v1."+_collection+".get", {id:ctx.params.id,owner:ctx.params.owner});
		},
		async mapItems(ctx) {	
			const _collection = ctx.params.collection;
			let _results = [];
			for(const id of ctx.params.ids) {
				let _params = Object.assign({},ctx.params.values);
				_params.id = id;
				const _result = await ctx.call("v1."+_collection+".update",  
				_params);
				_results.push(_result);
				
			}
			return _results;
			
		},
 		async getItems(ctx ) {
			console.log(ctx.params);
			const _collection = ctx.params.collection;
			return await ctx.call("v1."+_collection+".list", ctx.params);
		},
		async addItem(ctx) {
		
			const _collection = ctx.params.collection;
			const _result = await ctx.call("v1."+_collection+".create",  
				ctx.params);
			return _result;
		},
		async updateItem(ctx) {
			const _collection = ctx.params.collection;
			const _owner = await this.getOwner(ctx);
			const _update = await ctx.call("v1."+_collection+".get", {id:ctx.params._id});
			if(_owner._id != _update.owner) throw "Update premission fail";
			
			const _result = await ctx.call("v1."+_collection+".update",  
				ctx.params);
			return _result;
		},
		async saleSummary(ctx ) {
			return await ctx.call("v1.possale.summary", ctx.params);
		},
		async saleDetailSummary(ctx ) {
			return await ctx.call("v1.possaledetail.summary", ctx.params);
		},
		async orderSummary(ctx ) {
			return await ctx.call("v1.posorder.summary", ctx.params);
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