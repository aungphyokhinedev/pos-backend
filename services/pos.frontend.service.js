
"use strict";
const mongodbHelper = require("../common/mongo.db.helper");
const DbService = require("moleculer-db");
const { ForbiddenError } = require("moleculer-web").Errors;
const authorizationMixin = require("../mixin/frontend.authorization.mixin");
const passwordMixin = require("../mixin/password.mixin");
const constants = require("../common/constants");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const precheckMixin = require("../mixin/precheck.mixin");
const { calculateCharge } = require("../common/calculate.helper");
const PasswordStrengthCheck = require("../common/password.strength.check");
const loginAttemptLimit = 10;
module.exports = {
	name: "posfrontend",
	version: 1,
	mixins: [DbService, authorizationMixin, passwordMixin, precheckMixin],
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


				return await this.userLogin(ctx);
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
				if (ctx.params.status == "sale") {
					return await this.addOrderToSale(ctx);
				}
				else {
					return await this.orderProcess(ctx);
				}

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
			cache: {
                // Cache key:  
                //keys: ["collection","page", "pageSize", "populate","query","sort","search","searchFields","uid"],
                ttl: 30
            },
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
		addorderinfo: {
			params: {
			},
			async handler(ctx) {

				return await this.addOrderInfo(ctx);
			}
		},
		getinvoice: {
			params: {
			},
			async handler(ctx) {

				return await this.getInvoice(ctx);
			}
		},
		deletesale: {
			params: {
			},
			async handler(ctx) {

				return await this.deleteSale(ctx);
			}
		},
		getsale: {
			params: {
			},
			async handler(ctx) {

				return await this.getSale(ctx);
			}
		},
	},
	hooks: {
		before: {
			"*": ["paramGuard"],
			"getitems": ["checkUser"],
			"sale": ["checkUser"],
			"user": ["checkUser"],
			"shop": ["checkUser"],
			"changepassword": ["checkUser"],
			"updateuser": ["checkUser"],
			"updateitem": ["checkUser"],
			"orderprocess": ["checkUser"],
			"addorderinfo": ["checkUser"],
			"deletesale": ["checkUser"],
			"getsale": ["checkUser"],
			"getbyid": ["checkUser"],
			"getinvoice": ["checkUser"],
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
			//console.log("getitems",ctx.params);

			const _collection = ctx.params.collection;
			return await ctx.call("v1." + _collection + ".list", ctx.params);
		},
		async getUser(ctx) {
			const _user = await ctx.call("v1.posuser.get", { id: ctx.params.user });
			//console.log("_user", _user);
			if (_user.owner != ctx.params.owner) throw "Invalid Permission";
			return _user;
		},
		async getCustomer(ctx) {
		
			const _customers = await ctx.call("v1.poscustomer.find", 
			{ query: ctx.params.query },
			{ meta: { skipOwnerCheck: true } });
			return _customers[0];
		},
		async getShop(ctx) {

			const _user = await ctx.call("v1.posuser.get", { id: ctx.params.user });
			const _shop = await ctx.call("v1.posshop.find", {
				populate: ["tax", "discount"], query: { _id: _user.shop }
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
			//console.log("_data", _data);
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
				populate: ["discount", "tax"],
				query: {
					_id: _users[0].shop
				}
			});

			if (_shops.length == 0) {
				throw "Shop not found";
			}

			const _shop = _shops[0];
			const _ids = ctx.params.items.map(item => ObjectId(item._id));

			//	console.log("_ids:",_ids);
			const _shopitems = await ctx.call("v1.positem.find", {
				populate: ["discount"],
				query: {
					_id: { $in: _ids }
				}
			});
			//console.log("_shopitems:",_shopitems);

			const _items = _shopitems.map(item => {
				const _item = ctx.params.items.filter(_item => item._id == _item._id);

				if (_item && _item.length > 0 && _item[0].qty > 0) {

					const _discount = calculateCharge(item.unitPrice, item.discount);
					item.qty = _item[0].qty;
					item.total = _discount.totalAmount * _item[0].qty;
					item.discount = item.disocunt ? item.disocunt._id : null;
					item.discountAmount = _discount.totalAmount;
					return item;
				}
			});
			if (!_items || _items.length == 0) {
				throw "Invalid sale items";
			}

			const _total = _items.reduce((total, item) => {

				return total + item.total;
			}, 0);
			const _discount = (await calculateCharge(_total, _shop.discount)).totalRate;
			const _tax = calculateCharge(_total, _shop.tax).totalRate;

			//console.log(ctx.params);


			let _sale = {
				user: ctx.params.user,
				owner: ctx.params.owner,
				customer: ctx.params.customer,
				invoiceNumber: ctx.params.invoiceNumber,
				shop: _shop._id,
				status: constants.sale_error,
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
				delete _saleitem._id;
				_saleitem.sale = _result._id;
				_saleitem.owner = ctx.params.owner;
				_saleitem.user = ctx.params.user;
				_saleitem.item = _item._id;
				_saleitem.shop = _users[0].shop;
				_saleitem.invoiceNumber = ctx.params.invoiceNumber;
				await ctx.call("v1.possaledetail.create",
					_saleitem);
			}
			this.saleItemEvent(ctx.params.items, _users[0].shop);

			return await ctx.call("v1.possale.update",
				{ _id: _result._id, status: constants.sale_finish });
		},

		async saleItemEvent(items, shop) {
			//console.log("broadcast items",items);
			for (const _item of items) {
				//console.log("broadcast sale");
				this.broker.emit("posstock.sale", {
					qty: _item.qty,
					shop: shop,
					item: _item._id,
				});
			}

		},

		async userLogin(ctx) {
		
			const _owners = await ctx.call("v1.posowner.find", {
				query: { codeName: ctx.params.code }
			}, { meta: { skipOwnerCheck: true } });
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

						if(_loginUser.loginFail > loginAttemptLimit) throw "Too many login fails, please reset the password";
						if (_loginUser.delete) throw "User is deleted";
						if (_loginUser.locked) throw "User is locked";
						if (_loginUser.block) throw "User is blocked";

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

						this.setLoginSuccess(ctx,_users[0]);
						return _user;
					}
					else {
						const _result = await this.setLoginFail(ctx,_users[0]);
						return new ForbiddenError("Invalid password," + _result);
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
			//check new password
			PasswordStrengthCheck.check(ctx.params.newPassword);


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

			const _owners = await ctx.call("v1.posowner.find", 
				{ query: { codeName: ctx.params.code } }
				, { meta: { skipOwnerCheck: true } });
			if (_owners.length == 0) throw "Invalid business code";

			const _users = await ctx.call("v1.posuser.find", { query: { name: ctx.params.name, owner: _owners[0]._id } });

			//console.log("_users", _users);
			if (_users.length > 0) {
				const _randompassword = await ctx.call("v1.crypto.generatePassword", { length: 10 });
				//send with email
				await ctx.call("v1.mailer.send", {
					to: _users[0].email,
					subject: "New login password",
					html: "Your new login password is " + _randompassword
				});
				// eslint-disable-next-line require-atomic-updates
				const _password = await ctx.call("v1.crypto.hashedPassword", { data: _randompassword, saltRounds: 10 });

				return await ctx.call("v1.posuser.update", 
				{ id: _users[0]._id, 
					password: _password });
			}
			else {
				throw "User not found";
			}

		},
		async checkOrder(ctx) {
			const _order = await ctx.call("v1.posorder.get", {
				id: ctx.params._id
			});

			const _user = await ctx.call("v1.posuser.get", {
				id: ctx.params.user
			});


			if (!_order) throw "Order not found";
			if (_order.status != constants.order_pending) throw "Order status cannot update";
			if (!_user) throw "User not found";


			if (_order.shop + "" != _user.shop + "") throw "Invalid permission";
			return _order;
		},
		async orderProcess(ctx) {
			const _order = await this.checkOrder(ctx);

			const _status = ctx.params.status == constants.order_reject ? constants.order_reject : constants.order_accept;
			const _rejectlIds = ctx.params.rejectIds;

			let _updateAmount;
			if (_status == constants.order_accept) {

				//if some item reject
				if (_rejectlIds.length > 0) {
					for (const id of _rejectlIds) {
						await ctx.call("v1.posorderdetail.update", { id: id, status: constants.order_reject });
					}


					const _detailItems = await ctx.call("v1.posorderdetail.find",
						{ query: { order: _order._id } });

					const _total = _detailItems.reduce((total, item) => {
						return total + (_rejectlIds.includes(item._id) ? 0 : item.total);
					}, 0);
					const _shops = await ctx.call("v1.posshop.find", {
						populate: ["discount", "tax"],
						query: {
							_id: _order.shop
						}
					});

					const _discount = (await calculateCharge(_total, _shops[0].discount)).totalRate;
					const _tax = calculateCharge(_total, _shops[0].tax).totalRate;

					_updateAmount = {
						total: _total,
						discountAmount: _discount,
						taxAmount: _tax
					};
				}
			}
			let _message = _status == constants.order_accept && _rejectlIds.length > 0 ?
				"Order approved but some item is not available" :
				_status == constants.order_accept ? "Order approved" :
					"Order is rejected";


			this.setNoti(ctx, {
				event: "order-" + _order.customer, data: {
					action: _status,
					type: "order",
					message: _message,
					customer: _order.customer,
					title: "Order No. " + _order.orderNumber,
					id: _order._id
				}
			});



			let _result;

			if (_updateAmount) {
				_result = await ctx.call("v1.posorder.update", {
					id: ctx.params._id,
					status: _status,
					discountAmount: _updateAmount.discountAmount,
					taxAmount: _updateAmount.taxAmount,
					total: _updateAmount.total + _updateAmount.taxAmount - _updateAmount.discountAmount
				});
			}
			else {
				_result = await ctx.call("v1.posorder.update", { id: ctx.params._id, status: _status });
			}


			//adding order to sale
			//if(_status == constants.order_accept ){
			//	this.addOrderToSale(ctx,_rejectlIds);
			//}


			return _result;

		},

		async addOrderToSale(ctx) {
			const _order = await ctx.call("v1.posorder.get", {
				id: ctx.params._id
			});
			if (!_order) throw "Invalid order";
			if (_order.status != constants.order_accept) throw "Need to accept order fristly";
			if (_order.status == constants.order_finish) throw "Already added to sale";

			const _user = await ctx.call("v1.posuser.get", {
				id: ctx.params.user
			});
			if (_order.shop.toString() != _user.shop.toString()) throw "Invalid permission";

			let _invoiceNo = "OD" + _order.orderNumber;
			//console.log("order to sale",_order._id);
			let _sale = {
				name: _invoiceNo,
				remark: "Amount:" + _order.total + ",Tax:" + _order.taxAmount + ",Discount:" + _order.discountAmount,
				invoiceNumber: _invoiceNo,
				adjustment: 0,
				total: _order.total,
				user: ctx.params.user,
				owner: _order.owner,
				customer: _order.customer,
				shop: _order.shop,
				tax: _order.tax,
				taxAmount: _order.taxAmount,
				discount: _order.discount,
				discountAmount: _order.discountAmount,
				date: Date.now()
			};

			const _orderDetails = await ctx.call("v1.posorderdetail.find", {
				populate: ["item"],
				query: { order: _order._id }
			});

			const _result = await ctx.call("v1.possale.create",
				_sale);


			let _saleDetails = [];
			for (const _item of _orderDetails) {
				if (_item.status != constants.order_reject) {
					let _saleitem = {
						sale: _result._id,
						item: _item.item.item,
						//total:_item.total,
						qty: _item.qty,
						owner: _item.owner,
						name: _item.name,
						unitPrice: _item.total,
						amount: _item.total,
						discountedPrice: _item.discountAmount,
						discount: _item.discount,
						user: ctx.params.user,
						invoiceNumber: _invoiceNo,
						shop: _order.shop,
					};
					_saleDetails.push(_saleitem);
					await ctx.call("v1.possaledetail.create",
						_saleitem);
				}

			}


			this.saleItemEvent(_saleDetails, _order.shop,);
			await ctx.call("v1.posorder.update", { id: _order._id, status: constants.order_finish });

			return await ctx.call("v1.possale.update",
				{ _id: _result._id, status: constants.sale_finish });


		},
		async setNoti(ctx, params) {
			await ctx.call("v1.possocket.broadcast", params);
			await ctx.call("v1.posnoti.create", params.data);
		},
		async getByID(ctx) {
			const _collection = ctx.params.collection;

			const _result = await ctx.call("v1." + _collection + ".get", { id: ctx.params.id, owner: ctx.params.owner });

			if (_result.owner != ctx.params.owner) throw "Invalid transaction owner";
			return _result;
		},
		async updateItem(ctx) {

			const _collection = ctx.params.collection;
			const _result = await ctx.call("v1." + _collection + ".update",
				ctx.params);
			return _result;
		},
		async addOrderInfo(ctx) {
			const _order = await ctx.call("v1.posorder.get", { id: ctx.params.order });
			if (!_order) throw "Invalid Order";
			if (_order.shop != ctx.params.shop) throw "Invalid Permission";
			// eslint-disable-next-line require-atomic-updates
			ctx.params.orderNumber = _order.orderNumber;
			// eslint-disable-next-line require-atomic-updates
			ctx.params.customer = _order.customer;
			const _result = await ctx.call("v1.posordertrack.create",
				ctx.params);
			return _result;
		},
		async getInvoice(ctx) {
			let _data;
			const _sale = await ctx.call("v1.possale.get", { id: ctx.params.id, populate: ["customer", "user", "shop"] });
			if (!_sale) throw "Invalid Sale";

			if (_sale.owner != ctx.params.owner) "Invalid Permission";
			//console.log("sale",_sale);
			_data = Object.assign({}, _sale);
			const _saledetails = await ctx.call("v1.possaledetail.find", {
				query: { sale: _sale._id }
			});
			//console.log("sale",_saledetails);
			_data = Object.assign(_data, { items: _saledetails });
			return _data;

		},
		async deleteSale(ctx) {
			const _sale = await ctx.call("v1.possale.get", { id: ctx.params.id });
			if (!_sale) throw "Invalid Sale";
			if (_sale.user != ctx.params.user) throw "Permission not allowed";

			const _saleDetails = await ctx.call("v1.possaledetail.find",
				{
					query: {
						sale: _sale._id,
						user: ctx.params.user
					}
				});
			_saleDetails.map(async (item) => {
				await ctx.call("v1.possaledetail.update",
					{ id: item._id, deleteFlag: true });
			});
			await ctx.call("v1.possale.update",
				{ id: ctx.params.id, deleteFlag: true });

			return true;


		},
		async getSale(ctx) {

			const _saleDetails = await ctx.call("v1.possaledetail.find",
				{ query: { sale: ctx.params.id } });

			const _ids = _saleDetails.map(item => item.item);
			const _saleItems = await ctx.call("v1.positem.find",
				{ query: { _id: { $in: _ids } } });

			const _items = _saleItems.map(item => {
				const _newitem = Object.assign({}, item);
				const _sale = _saleDetails.filter(saleitem => saleitem.item == item._id)[0];
				_newitem.qty = _sale ? _sale.qty : 0;
				_newitem.amount = _sale ? _sale.amount : 0;
				return _newitem;
			});

			//console.log("...",_items.length);
			return _items;


		},
		async setLoginSuccess(ctx,posuser) {	
			await ctx.call("v1.posuser.update",
			{ id: posuser._id, 
				lastLoggedInDate: Date.now(), 
				loginFail: 0, 
				lastSucessfullLoggedInDate: Date.now()});
			
		},
		async setLoginFail(ctx,posuser) {	
			const _fails = posuser.loginFail?posuser.loginFail:0;
			const _remainingLimit = loginAttemptLimit - _fails;
			await ctx.call("v1.posuser.update",
			{ id: posuser._id, lastLoggedInDate: Date.now(), loginFail: _fails + 1});
			return "You only have (" + _remainingLimit + ") login attempt left";
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