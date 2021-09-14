
"use strict";
const DbService = require("moleculer-db");
const authorizationMixin = require("../mixin/authorization.mixin");
const mongoose = require("mongoose");
const { ForbiddenError } = require("moleculer-web").Errors;
const constants = require("../common/constants");
const ObjectId = mongoose.Types.ObjectId;
const {calculateCharge} = require("../common/calculate.helper");
const precheckMixin = require("../mixin/precheck.mixin");
const _sharableCollections = [
	"posshop",
];
const _publicCollections = [
	"posshop",
	"positem",
	"posshopitem",
	"posranking",
	"posreview",
	"posordertrack",
	"posfavourite",
	"posextrainfo",
	"posworkhour",
	"poscategory",
	"possaledetail"
];
module.exports = {
	name: "pospublic",
	version: 1,
	mixins: [DbService,authorizationMixin,precheckMixin],
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
			cache: {
                // Cache key:  
                //keys: ["collection","page", "pageSize", "populate","query","sort","search","searchFields","uid"],
                ttl: 30
            },
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
		ordercancel : {
			params: {
			},
			async handler(ctx) {
				
				const _customer = await this.getCustomer(ctx);
				// eslint-disable-next-line require-atomic-updates
				ctx.params.customer = _customer._id;
				return await this.cancelOrder(ctx);
			}
		},
		totalrank: {
			cache: {
                // Cache key:  
                //keys: ["collection","page", "pageSize", "populate","query","sort","search","searchFields","uid"],
                ttl: 30
            },
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
				},
				);
				if(!_shopitem) throw "Owner not found";
				// eslint-disable-next-line require-atomic-updates
				ctx.params.owner = _shopitem.owner;
				return await this.addReview(ctx);
			}
		},
		setfavourite: {
			params: {
			},
			async handler(ctx) {
				return await this.setFavourite(ctx);
			}
		},
		getoffer: {
			params: {
			},
			async handler(ctx) {
				return await this.getOffer(ctx);
			}
		},
		invoiceclaim : {
			params: {
			},
			async handler(ctx) {
				
				const _customer = await this.getCustomer(ctx);
				// eslint-disable-next-line require-atomic-updates
				ctx.params.customer = _customer._id;
				return await this.invoiceClaim(ctx);
			}
		},
	},
	hooks: {
		before: {
			//this is needed for checking prohibited params
			"*": ["paramGuard"],	
			"getaccount":["checkOwner"],
			"getcustomer":["checkOwner"],
			"addcustomer":["checkOwner"],
			"updatecustomer":["checkOwner"],
			"getbyid":["checkOwner"],
			"mapitems":["checkOwner"],
			"finditems":["checkOwner"],
			"getitems":["checkOwner"],
			"additem":["checkOwner"],
			"updateitem":["checkOwner"],
			"orderitems":["checkOwner"],
			"ordercancel":["checkOwner"],
			"addreview":["checkOwner"],
			"setfavourite":["checkOwner"],
			"invoiceclaim":["checkOwner"],
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
			console.log("get customer");
			const _customer = await ctx.call("v1.poscustomer.find", {
				query: { customer: ctx.params.uid + "" }
			});
			if(_customer.length == 0){
				return new ForbiddenError("Customer not found");
			}
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
			this.broker.cacher.clean("poscustomer-**");	
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

		/// to control isPublic flag on posshop etc...
		addAccessControl(ctx){
			const _sharable = _sharableCollections.indexOf(ctx.params.collection.toLowerCase()) >= 0;
			if(_sharable){
				if(ctx.params.query) {
					ctx.params.query["isPublic"] = true;
				}
			}
		},
		async findItems(ctx) {

			this.addAccessControl(ctx);
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
			this.addAccessControl(ctx);
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
			this.broker.cacher.clean(_collection + "-**");	
			return _result;
		},
		async orderItems(ctx) {
			
		
			if(ctx.params.customer == 0){
				throw "Customer not found";
			}

		
		
			//getting  shop info
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
			///getting shop items
			const _shopitems = await ctx.call("v1.posshopitem.find", {
				populate:["discount"],
				query: { 
					_id: { $in: _ids },
					//shop: ObjectId(ctx.params.shop)
				} 
			});

			
			//black list check
			const _blacklist = await ctx.call("v1.posblacklist.find", {
				query: { 
					customer:ctx.params.customer,
					owner: _shop.owner,
					deleteFlag: false
				} 
			});
	
			if(_blacklist.length > 0) throw "Orders does not allowed. [" + _blacklist[0].description + "]";
			//black list check done
		
			const _items = await  Promise.all(ctx.params.items.map(async(requestitem)=>{

				const _shopitem = _shopitems.filter(_item=>requestitem._id == _item._id)[0];
				console.log("item name :", _shopitem.name);
				if(_shopitem  && requestitem.qty > 0){

					let _extrainfo = null;
				
					//for extra info check
					if(_shopitem.options){
						if(! requestitem.options) throw "Invalid Options";
						console.log("finding extra info", _shopitem.name);
						const _find =  "^" + requestitem.options.split(",").map(item=>{
							const _split = item.split(":");
							return _split[0] + ":(" + _split[1] + "|all)";
						}).join(",");

						_extrainfo = await ctx.call("v1.posextrainfo.find", {
							query: { 
								shopItem: _shopitem._id,
								deleteFlag: false,
								value:  {"$regex": _find} 
								//shop: ObjectId(ctx.params.shop)
							} 
						});

						_extrainfo = _extrainfo.length > 0 ? _extrainfo[0] : null;
					}
					
					const _unitPrice = (_extrainfo && _extrainfo.unitPrice) ? _extrainfo.unitPrice : _shopitem.unitPrice;
					const _photo = (_extrainfo && _extrainfo.photo) ? _extrainfo.photo : _shopitem.photo;
					
					const _discount =  calculateCharge(
						_unitPrice,_shopitem.discount);
					let _newitem = Object.assign({},_shopitem);
					_newitem.options = requestitem.options,
					_newitem.photo = _photo;
					_newitem.qty = requestitem.qty;
					_newitem.total = _discount.totalAmount * requestitem.qty;
					_newitem.discount = _shopitem.disocunt ? _shopitem.disocunt._id : null;
					_newitem.discountAmount =  _discount.totalAmount;
					
					console.log("_newitem",_newitem);
					return _newitem;
				}
				else{
					throw "invalid order data";
				}
			}));
			
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
				status: constants.order_error,
				tax: _shop.tax ? _shop.tax._id : null,
				taxAmount: _tax,
				discount: _shop.discount ? _shop.discount._id : null,
				discountAmount: _discount,
				total: _total - _discount + _tax,
				date: Date.now(),
				remark: ctx.params.remark


			};
			const _result = await ctx.call("v1.posorder.create",  
				_order);
			console.log("order created");
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
					options: _item.options,
					photo: _item.photo
				};
				await ctx.call("v1.posorderdetail.create",  
					_orderitem);
				
			}

			this.setNoti(ctx,{
				event: "order-" + _result.shop, data: {
					action: "refresh", 
					type: "order",
					customer: _result.customer,
					message: "New order received",
					title: "Order No. " +  _result.orderNumber,
					shop: _result.shop,
					owner: _result.owner,
					id: _result._id
				}
			});
		
			const _resultOrder = await ctx.call("v1.posorder.update",  
				{_id: _result._id, status:constants.order_pending});

			this.broker.cacher.clean("posorder-**");
			this.broker.cacher.clean("posorderdetail-**");		
			return _resultOrder;

		},
		async cancelOrder(ctx) {

			const _order = await ctx.call("v1.posorder.get", {
				id: ctx.params._id
			});

			if (!_order) throw "Order not found";
			if(_order.status != constants.order_pending) throw "Order status cannot update";
			if(_order.customer + "" != ctx.params.customer + "") throw "Invalid permission";

			const _resultOrder =  await ctx.call("v1.posorder.update",  
				{_id: ctx.params._id, status:"cancel"});
			this.broker.cacher.clean("posorder-**");
			return _resultOrder;

		},
		totalRank(ctx) {
			return ctx.call("v1.posranking.total",ctx.params);
		},
		async setNoti(ctx, params) {
			await ctx.call("v1.possocket.broadcast",params);
			await ctx.call("v1.posnoti.create",params.data);
			this.broker.cacher.clean("posnoti-**");
		},
		async addReview(ctx) {
			const _result = await ctx.call("v1.posreview.create",
				ctx.params);
			this.broker.cacher.clean("posreview-**");
			return _result;
		},
		async setFavourite(ctx){

			const _favourite = await ctx.call("v1.posfavourite.find", {
				query: { 
					user: ctx.params.user, transactionID: ctx.params.transactionID
				} 
			});

			let _result;
			if(_favourite.length > 0){
				_result = await ctx.call("v1.posfavourite.remove",
					{id:_favourite[0]._id});
				
			}
			else{
				_result = await ctx.call("v1.posfavourite.create",
					ctx.params);
				
			}
			this.broker.cacher.clean("posfavourite-**");
			return _result;
			
			

		},

		async getOffer(ctx){

			const _offers = await ctx.call("v1.posoffer.find", {
				query: { 
					type: ctx.params.type == "shop" ? "OFFERSHOP" : "OFFERITEM"
				} 
			});
			if(_offers.length > 0){
				const _ids = _offers.map(item=>ObjectId(item.id));
				
				const _result = 	await ctx.call( ctx.params.type == "shop" ? "v1.posshop.find" : "v1.posshopitem.find", {
					populate:["owner"],
					query: { 
						_id : {$in: _ids}
					} 
				});
				return { rows: _result};
				
			}
			else{
				return { rows: [] };
			}	

		},
		async invoiceClaim(ctx) {
			console.log("invoies",ctx.params);
			const _sale = await ctx.call("v1.possale.get", {
				id: ctx.params.id
			});
			if(!_sale) throw "Invoice Notfound";
			console.log("invoies",_sale.invoiceNumber);
			if(_sale.invoiceNumber != ctx.params.invoiceNumber) throw "Invalid Invoice";
			if(_sale.customer) throw "Invoice is already claimed";
			const _result = await ctx.call("v1.possale.update",
				{ _id: ctx.params.id, customer: ctx.params.customer});
			this.broker.cacher.clean("possale-**");
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