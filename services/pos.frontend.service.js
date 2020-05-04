
"use strict";
const DbService = require("moleculer-db");
const { ForbiddenError } = require("moleculer-web").Errors;
const authorizationMixin = require("../mixin/frontend.authorization.mixin");
const passwordMixin = require("../mixin/password.mixin");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const {calculateCharge} = require("../common/calculate.helper");
module.exports = {
	name: "posfrontend",
	version: 1,
	mixins: [DbService,authorizationMixin, passwordMixin],
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
			return "Hello POS Front End";
		},
		userlogin: {
			params: {

			},
			async handler(ctx) {
				console.log("login", ctx.params);
				return await this.userLogin(ctx);
			}
		},
		getitems: {
			params: {
			},
			async handler(ctx) {
			
				// eslint-disable-next-line require-atomic-updates
				ctx.params.query.owner = ctx.params.owner;
				return await this.getItems(ctx);
			}
		},
		sale: {
			params: {
			},
			async handler(ctx) {
				return await this.saleItems(ctx);
			}
		},
		user: {
			params: {
			},
			async handler(ctx) {
				return await this.getUser(ctx);
			}
		},
		customer: {
			params: {
			},
			async handler(ctx) {
				return await this.getCustomer(ctx);
			}
		},
		shop: {
			params: {
			},
			async handler(ctx) {
				return await this.getShop(ctx);
			}
		},
		changepassword: {
			params: {
			},
			async handler(ctx) {
				return await this.changePassword(ctx);
			}
		},
		updateuser: {
			params: {
			},
			async handler(ctx) {

				return await this.updateUser(ctx);
			}
		},
		orderprocess: {
			params: {
			},
			async handler(ctx) {
				return await this.orderProcess(ctx);
			}
		},
		resetpassword: {
			params: {
			},
			async handler(ctx) {
				return await this.resetPassword(ctx);
			}
		},
		getbyid: {
			params: {
			},
			async handler(ctx) {
				return await this.getByID(ctx);
			}
		},
		updateitem: {
			params: {
			},
			async handler(ctx) {
				return await this.updateItem(ctx);
			}
		},
	},
	hooks: {
		before: {
			"getitems": ["checkUser"],
			"sale": ["checkUser"],
			"user": ["checkUser"],
			"shop": ["checkUser"],
			"changepassword": ["checkUser"],
			"updateuser": ["checkUser"],
			"updateitem": ["checkUser"],
			"orderprocess": ["checkUser"],
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
		async getItems(ctx) {
			console.log("getitems",ctx.params);
			
			const _collection = ctx.params.collection;
			return await ctx.call("v1." + _collection + ".list", ctx.params);
		},
		async getUser(ctx) {
			const _user = await ctx.call("v1.posuser.get", { id: ctx.params.user });
			console.log("_user", _user);
			return _user;
		},
		async getCustomer(ctx) {
			const _customers = await ctx.call("v1.poscustomer.find", { query: ctx.params.query });
			return _customers[0];
		},
		async getShop(ctx) {
		
			const _user = await ctx.call("v1.posuser.get", { id: ctx.params.user });
			const _shop = await ctx.call("v1.posshop.find", {
				populate:["tax","discount"],	query: { _id: _user.shop }
			});
			return _shop[0];
			
		
		},
		async updateUser(ctx) {

			let _data = {
				_id: ctx.params.user
			};
			if (ctx.params.photo) {
				_data.photo = ctx.params.photo;
			}
			if (ctx.params.fullName) {
				_data.fullName = ctx.params.fullName;
			}
			console.log("_data", _data);
			const _result = await ctx.call("v1.posuser.update",
				_data);
			return _result;
		},
		async getSalePrices(ctx) {
			const _itemsIds = ctx.params.items.map(x => x._id);
			const _items = await ctx.call("v1.positem.find", {
				query: { _id: { $in: _itemsIds } }
			});

			let _prices = [];
			for (const _item of ctx.params.items) {
				const _currentItem = _items.filter(x => x._id == _item._id);
				const _amount = _currentItem.unitPrice * _item.qty;
				let _price = Object.assign(_item);
				_price.amount = _amount;
				_prices.push(_prices);
			}
			return _prices;
		},
		async saleItems(ctx) {

			const _users = await ctx.call("v1.posuser.find", {
				query: {
					_id: ctx.params.user
				}
			});

			if (_users.length == 0) {
				throw "User not found";
			}

			const _shops = await ctx.call("v1.posshop.find", {
				populate:["discount","tax"],
				query: { 
					_id: _users[0].shop
				} 
			});

			if(_shops.length == 0){
				throw "Shop not found";
			}

			const _shop = _shops[0];
			const _ids = ctx.params.items.map(item=>ObjectId(item._id));
			
			const _shopitems = await ctx.call("v1.positem.find", {
				populate:["discount"],
				query: { 
					_id: { $in: _ids }
				} 
			});
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
				throw "Invalid sale items";
			}
			const _total = _items.reduce((total,item)=>{
				return total +  item.total;
			},0);
			const _discount = (await calculateCharge(_total,_shop.discount)).totalRate;
			const _tax = calculateCharge(_total,_shop.tax).totalRate;

			console.log(ctx.params);
		
			const _invno = Date.now();
			let _sale = {
				user: ctx.params.user,
				owner: ctx.params.owner,
				invoiceNumber :_invno, 
				shop: _shop._id,
				status: "pending",
				name: ctx.params.name,
				remark: ctx.params.remark,
				adjustment: ctx.params.adjustment,
				adjustmentRemark: ctx.params.adjustmentRemark,
				tax: _shop.tax ? _shop.tax._id : null,
				taxAmount: _tax,
				discount: _shop.discount ? _shop.discount._id : null,
				discountAmount: _discount,
				total: _total - _discount + _tax,
				date: Date.now() 
			};
	
			
			const _result = await ctx.call("v1.possale.create",
				_sale);

			for (const _item of ctx.params.items) {

				let _saleitem = Object.assign({}, _item);
				_saleitem._id = null;
				_saleitem.sale = _result._id;
				_saleitem.owner = ctx.params.owner;
				_saleitem.user = ctx.params.user;
				_saleitem.item = _item._id;
				_saleitem.shop = _users[0].shop;
				_saleitem.invoiceNumber = _invno;
				await ctx.call("v1.possaledetail.create",
					_saleitem);
			}

			await ctx.call("v1.possale.update",
				{ _id: _result._id, status: "done" });
		},

		async userLogin(ctx) {
			const _owners = await ctx.call("v1.posowner.find", {
				query: { codeName: ctx.params.code }
			});
			if (_owners && _owners.length > 0) {
				const _users = await ctx.call("v1.posuser.find", {
					query: {
						owner: _owners[0]._id,
						name: ctx.params.name
					}
				});
				if (_users && _users.length > 0) {

					const _valid = await ctx.call("v1.crypto.validatePassword", { data: ctx.params.password, encrypted: _users[0].password });

					if (_valid) {

						let _loginUser = Object.assign({}, _users[0]);
						
						if(_loginUser.delete) throw "User is deleted";
						if(_loginUser.locked) throw "User is locked";
						if(_loginUser.block) throw "User is blocked";

						const _accessToken = await ctx.call("v1.jwt.signToken", {
							data: {
								_id: _owners[0].owner,
								owner: _owners[0]._id,
								user: _loginUser._id,
							}
						});
						// eslint-disable-next-line require-atomic-updates
						ctx.meta.$responseHeaders = {
							"accessToken": _accessToken
						};
						
						const _user = {
							createdAt: _loginUser.createdAt,
							description: _loginUser.description,
							email: _loginUser.email,
							fullName: _loginUser.fullName,
							mobile: _loginUser.mobile,
							name: _loginUser.name,
							owner: _loginUser.owner,
							photo: _loginUser.photo,
							shop: _loginUser.shop,
							uid: _loginUser.uid,
							_id: _loginUser._id
						};

						return _user;
					}
					else {
						return new ForbiddenError("Invalid password");
					}
				}
				else {
					throw "User not found";
				}
			}
			else {
				throw "Owner not found";
			}

		},
		async changePassword(ctx) {

			const _user = await ctx.call("v1.posuser.get", {
				id: ctx.params.user
			});
			if (_user) {

				const _valid = await ctx.call("v1.crypto.validatePassword", { data: ctx.params.currentPassword, encrypted: _user.password });

				if (_valid) {

					//hashing new password
					const _newPassword = await ctx.call("v1.crypto.hashedPassword", { data: ctx.params.newPassword, saltRounds: 10 });
					//saving new password

					return await ctx.call("v1.posuser.update", { id: _user._id, password: _newPassword, lastPasswordChange: Date.now() });
				}
				else {
					return new ForbiddenError("Invalid password");
				}
			}
			else {
				throw "User not found";
			}

		},
		async resetPassword(ctx) {

			const _owners = await ctx.call("v1.posowner.find", { query: { codeName: ctx.params.code } });
			if (_owners.length == 0) throw "Invalid business code";

			const _users = await ctx.call("v1.posuser.find", { query: { name: ctx.params.name, owner: _owners[0]._id } });

			console.log("_users", _users);
			if (_users.length > 0) {
				const _randompassword = await ctx.call("v1.crypto.generatePassword", { length: 7 });
				//send with email
				await ctx.call("v1.mailer.send", {
					to: _users[0].email,
					subject: "New login password",
					html: "Your new login password is " + _randompassword
				});
				// eslint-disable-next-line require-atomic-updates
				const _password = await ctx.call("v1.crypto.hashedPassword", { data: _randompassword, saltRounds: 10 });

				return await ctx.call("v1.posuser.update", { id: _users[0]._id, password: _password });
			}
			else {
				throw "User not found";
			}

		},
		async orderProcess(ctx) {

			const _order = await ctx.call("v1.posorder.get", {
				id: ctx.params._id
			});

			const _user = await ctx.call("v1.posuser.get", {
				id: ctx.params.user
			});

			if (!_order) throw "Order not found";
			if (!_user) throw "User not found";


			if (_order.shop + "" != _user.shop + "") throw "Invalid permission";


			const _status = ctx.params.status == "reject" ? "reject" : "accept";
			const _rejectlIds = ctx.params.rejectIds;

			if (_status == "accept") {

				for (const id of _rejectlIds) {
					await ctx.call("v1.posorderdetail.update", { id: id, status: "reject" });
				}

			}
			let _message = _status == "accept" && _rejectlIds.length > 0 ?
				"Order approved but some item is not available" :
				_status == "accept" ? "Order approved" :
					"Order is rejected";

			
			this.setNoti(ctx,{
				event: "order-" + _order.customer, data: {
					action: _status, 
					type: "order",
					message: _message,
					customer: _order.customer,
					title: "Order No. " +  _order.orderNumber,
					id: _order._id
				}
			});

		
		
			return await ctx.call("v1.posorder.update", { id: ctx.params._id, status: _status });


		},
		async setNoti(ctx, params) {
			await ctx.call("v1.possocket.broadcast",params);
			await ctx.call("v1.posnoti.create",params.data);
		},
		async getByID(ctx) {
			const _collection = ctx.params.collection;
			return await ctx.call("v1." + _collection + ".get", { id: ctx.params.id, owner: ctx.params.owner });
		},
		async updateItem(ctx) {
			console.log("updateite", ctx.params);
			const _collection = ctx.params.collection;
			const _result = await ctx.call("v1." + _collection + ".update",
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