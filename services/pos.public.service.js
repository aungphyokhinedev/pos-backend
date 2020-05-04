
"use strict";
const DbService = require("moleculer-db");
const authorizationMixin = require("../mixin/authorization.mixin");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const {calculateCharge} = require("../common/calculate.helper");
const _publicCollections = ["posshop","positem","posshopitem","posrating","posreview","possaledetail"];
module.exports = {
	name: "pospublic",
	version: 1,
	mixins: [DbService,authorizationMixin],
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
			return "Hello POS Public";
		},
		getaccount: {
			params: {
			},
			async handler(ctx) {
			
				return await this.getAccount(ctx);
			}
		},
		getcustomer: {
			params: {
			},
			async handler(ctx) {
			
				return await this.getCustomer(ctx);
			}
		},

		addcustomer: {
			params: {
			},
			async handler(ctx) {

				ctx.params.customer = ctx.params.uid;
				return await this.addCustomer(ctx);
			}
		},
		updatecustomer: {
			params: {
			},
			async handler(ctx) {
				return await this.updateCustomer(ctx);
			}
		},
		getbyid: {
			params: {
			},
			async handler(ctx) {
				console.log("getbyid",ctx.params);
				return await this.getByID(ctx);
			}
		},
		mapitems: {
			params: {
			},
			async handler(ctx) {
				//const _customer = await this.getCustomer(ctx);
				// eslint-disable-next-line require-atomic-updates
				//ctx.params.query.owner = _customer._id;
				return await this.mapItems(ctx);
			}
		},
		finditems: {
			params: {
			},
			async handler(ctx) {
				return await this.findItems(ctx);
			}
		},
		getitems: {
			params: {
			},
			async handler(ctx) {
				
				const _publicData = _publicCollections.indexOf(ctx.params.collection.toLowerCase()) >= 0;
				if(!_publicData){
					const _customer = await this.getCustomer(ctx);
				
					let _query = Object.assign({},ctx.params.query);
					_query.customer = _customer._id;
					// eslint-disable-next-line require-atomic-updates
					ctx.params.query = _query;
				}
				
		

				return await this.getItems(ctx);
			}
		},
		additem: {
			params: {
			},
			async handler(ctx) {
				const _customer = await this.getCustomer(ctx);
				// eslint-disable-next-line require-atomic-updates
				ctx.params.customer = _customer._id;
				return await this.addItem(ctx);
			}
		},
		updateitem: {
			params: {
			},
			async handler(ctx) {
				return await this.updateItem(ctx);
			}
		},
		orderitems : {
			params: {
			},
			async handler(ctx) {
				
				const _customer = await this.getCustomer(ctx);
				// eslint-disable-next-line require-atomic-updates
				ctx.params.customer = _customer._id;
				return await this.orderItems(ctx);
			}
		},
		totalrank: {
			params: {
			},
			async handler(ctx) {
				return await this.totalRank(ctx);
			}
		},
		addreview: {
			params: {
			},
			async handler(ctx) {
				const _customer = await this.getCustomer(ctx);
				// eslint-disable-next-line require-atomic-updates
				ctx.params.customer = _customer._id;
				const _shopitem = await ctx.call("v1.posshopitem.get", {id:ctx.params.transactionID
				});
				if(!_shopitem) throw "Owner not found";
				// eslint-disable-next-line require-atomic-updates
				ctx.params.owner = _shopitem.owner;
				return await this.addReview(ctx);
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
		
		async getAccount(ctx) {
			const _account = await ctx.call("v1.auth.get", {
				id: ctx.params.uid
			});
			return _account;
		},
		async getCustomer(ctx) {
			const _customer = await ctx.call("v1.poscustomer.find", {
				query: { customer: ctx.params.uid + "" }
			});
			return _customer[0];

		},
		async addCustomer(ctx) {
			const _result = await ctx.call("v1.poscustomer.create",
				ctx.params);
			return _result;
		},
		async updateCustomer(ctx) {
			const _result = await ctx.call("v1.poscustomer.update",
				ctx.params);
			return _result;
		},
		async getByID(ctx) {
			const _collection = ctx.params.collection;
			return await ctx.call("v1." + _collection + ".get", { id: ctx.params.id });
		},
		async mapItems(ctx) {
			const _collection = ctx.params.collection;
			let _results = [];
			for (const id of ctx.params.ids) {
				let _params = Object.assign({}, ctx.params.values);
				_params.id = id;
				const _result = await ctx.call("v1." + _collection + ".update",
					_params);
				_results.push(_result);

			}
			return _results;

		},
		async findItems(ctx) {
            const _collection = ctx.params.collection;
            const _page = ctx.params.page || 1;
			const _pageSize = ctx.params.pageSize || 10;
			
			const _items = await ctx.call("v1."+_collection+".find",
				{ 
					//getting one more item to check next item exist
					limit: _pageSize + 1,
					offset: (_pageSize * (_page - 1)),
					query: ctx.params.query
				});
			//checking next page exist
			const _hasNext = _items.length == (_pageSize + 1);
			if(_hasNext){_items.pop();}
			
			return { rows:_items, hasNext:_hasNext, page:_page,pageSize:_pageSize, totalPages: Math.ceil(_items.length / _pageSize) };
		},
		async getItems(ctx) {
			const _collection = ctx.params.collection;  
			return await ctx.call("v1." + _collection + ".list", ctx.params);
		},
		async addItem(ctx) {
			const _collection = ctx.params.collection;
			const _result = await ctx.call("v1." + _collection + ".create",
				ctx.params);
			return _result;
		},
		async updateItem(ctx) {
			const _collection = ctx.params.collection;
			const _result = await ctx.call("v1." + _collection + ".update",
				ctx.params);
			return _result;
		},
		async orderItems(ctx) {
			
	
			if(ctx.params.customer == 0){
				throw "Customer not found";
			}
			const _shops = await ctx.call("v1.posshop.find", {
				populate:["discount","tax"],
				query: { 
					_id: ctx.params.shop
				} 
			});

			if(_shops.length == 0){
				throw "Shop not found";
			}

			 
			const _shop = _shops[0];
			const _ids = ctx.params.items.map(item=>ObjectId(item._id));
			
			const _shopitems = await ctx.call("v1.posshopitem.find", {
				populate:["discount"],
				query: { 
					_id: { $in: _ids },
					//shop: ObjectId(ctx.params.shop)
				} 
			});

			const _blacklist = await ctx.call("v1.posblacklist.find", {
				query: { 
					customer:ctx.params.customer,
					owner: _shop.owner,
					deleteFlag: false
				} 
			});

			if(_blacklist.length > 0) throw "Orders does not allowed. [" + _blacklist[0].description + "]";

		
		
			const _items = _shopitems.map(item=>{
				const _item = ctx.params.items.filter(_item=>item._id == _item._id);
			
				if(_item && _item.length > 0 && _item[0].qty > 0){

					const _discount =  calculateCharge(item.unitPrice,item.discount);
					item.qty = _item[0].qty;
					item.total = _discount.totalAmount * _item[0].qty;
					item.discount = item.disocunt ? item.disocunt._id : null;
					item.discountAmount =  _discount.totalAmount;
					return item;
				}
			});
			
			if(!_items || _items.length == 0){
				throw "Invalid order items";
			}
			const _total = _items.reduce((total,item)=>{
				return total +  item.total;
			},0);
			const _discount = (await calculateCharge(_total,_shop.discount)).totalRate;
			const _tax = calculateCharge(_total,_shop.tax).totalRate;

			const _orderno = Date.now();
			let _order = {
				customer: ctx.params.customer,
				shop: ctx.params.shop,
				owner: _shop.owner,
				orderNumber: _orderno,
				name: ctx.params.user.name,
				mobile:ctx.params.user.mobile,
				address:ctx.params.user.address,
				location:ctx.params.user.location,
				status: "pending",
				tax: _shop.tax ? _shop.tax._id : null,
				taxAmount: _tax,
				discount: _shop.discount ? _shop.discount._id : null,
				discountAmount: _discount,
				total: _total - _discount + _tax,
				date: Date.now()


			};
			const _result = await ctx.call("v1.posorder.create",  
			_order);
		
			for(const _item of _items){
			
				let _orderitem = {
					customer: ctx.params.customer,
					shop: ctx.params.shop,
					owner: _shop.owner,
					order: _result._id,
					item: _item._id,
					qty: _item.qty,
					orderNumber: _orderno,
					total: _item.total,
					name: _item.name,
				};
				await ctx.call("v1.posorderdetail.create",  
				_orderitem);
				
			}

			this.setNoti(ctx,{
				event: "order-" + _result.shop, data: {
					action: "refresh", 
					type: "order",
					message: "New order received",
					title: "Order No. " +  _result.orderNumber,
					shop: _result.shop,
					owner: _result.owner,
					id: _result._id
				}
			});
		
			return await ctx.call("v1.posorder.update",  
				{_id: _result._id, status:"done"});


		},
		totalRank(ctx) {
			return ctx.call("v1.posranking.total",ctx.params);
		},
		async setNoti(ctx, params) {
			await ctx.call("v1.possocket.broadcast",params);
			await ctx.call("v1.posnoti.create",params.data);
		},
		async addReview(ctx) {
			const _result = await ctx.call("v1.posreview.create",
				ctx.params);
			return _result;
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