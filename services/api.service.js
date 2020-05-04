"use strict";
const SocketIOService = require("moleculer-io");
const ApiGateway = require("moleculer-web");
//require("events").EventEmitter.prototype._maxListeners = 100;
module.exports = {
	name: "api",
	mixins: [ApiGateway, SocketIOService],

	// More info about settings: https://moleculer.services/docs/0.13/moleculer-web.html
	settings: {
		port: process.env.PORT || 3000,
		io: {
			namespaces: {
				"/": {
					events: {
						"call": {
							mappingPolicy: "all",
							aliases: {
								"socket": "v1.socket.hello",
								"join": "v1.socket.join",
								"leave": "v1.socket.leave",
								"list": "v1.socket.list",
							},
							onBeforeCall: async function(ctx, socket, action, params, callOptions) { 
								//before hook to pass access token
								ctx.meta.authorization = socket.handshake.query.authorization;
							  },
						},

					}
				}
			}
		},
		cors: {
			// Configures the Access-Control-Allow-Origin CORS header.
			origin: "*",
			// Configures the Access-Control-Allow-Methods CORS header. 
			methods: ["GET", "OPTIONS", "POST", "PUT", "DELETE"],
			// Configures the Access-Control-Allow-Headers CORS header.
			allowedHeaders: ["content-type", "authorization"],
			// Configures the Access-Control-Expose-Headers CORS header.
			exposedHeaders: ["accessToken"],
			// Configures the Access-Control-Allow-Credentials CORS header.
			credentials: false,
			// Configures the Access-Control-Max-Age CORS header.
			maxAge: 3600
		},
		routes: [{

			path: "/api",
			authorization: true,
			whitelist: [
				// Access to any actions in all services under "/api" URL
				"**"
			],
			// You should disable body parsers
			bodyParsers: {
				json: true,
				urlencoded: false
			},

			aliases: {
				//Test Crypto
				"POST /crypto/hash": "v1.crypto.hashedPassword",
				"POST /crypto/validate": "v1.crypto.validatePassword",

				// File upload from HTML form
				"POST /file/list": "v1.file.list",
				"DELETE file/:id": "v1.file.delete",
				"POST /file/upload": "multipart:v1.file.save",
				"GET /file/get": "file.get",

				// Auth
				"POST /auth/getbyids": "v1.auth.getByIds",
				"DELETE /auth/:id": "v1.auth.remove",
				"PUT /auth/:id": "v1.auth.update",
				"POST /auth/list": "v1.auth.list",

				"POST /auth/login": "v1.auth.login",
				"POST /auth/social/login": "v1.auth.socialLogin",
				"POST /auth/register": "v1.auth.register",
				"POST /auth/social/register": "v1.auth.socialRegister",
				"POST /auth/internal/register": "v1.auth.internalRegister",

				"POST /auth/reset/send": "v1.auth.sendResetCode",
				"PUT /auth/reset/password": "v1.auth.resetPassword",
				"PUT /auth/change/password": "v1.auth.changePassword",
				"PUT /auth/logout": "v1.auth.logout",


				// Rule
				"REST rule": "v1.rule",
				"POST /rule/list": "v1.rule.list",

				// User Group
				"REST usergroup": "v1.usergroup",
				"POST /usergroup/list": "v1.usergroup.list",

				// Access Rule
				"REST accessrule": "v1.accessrule",
				"POST /accessrule/list": "v1.accessrule.list",

				// Application
				"REST application": "v1.application",
				"POST /application/list": "v1.application.list",

				// Service
				"REST service": "v1.service",
				"POST /service/list": "v1.service.list",

				// Permission
				"REST permission": "v1.permission",
				"POST /permission/list": "v1.permission.list",

				//Authorization
				"POST authorization/rule": "v1.authorization.getRules",
				"POST authorization/access": "v1.authorization.getAccess",
				"POST authorization/permission": "v1.authorization.getServicePermission",
				"POST authorization/resolveToken": "v1.authorization.resolveToken",

				//JWT
				"POST jwt/verify": "v1.jwt.verifyToken",
				"POST jwt/sign": "v1.jwt.signToken",

				//Test Services
				"GET jwt/test": "v1.jwt.hello",
				"GET file/test": "v1.file.hello",
				"GET crypto/test": "v1.crypto.hello",
				"GET auth/test": "v1.auth.hello",
				"GET mailer/test": "v1.mailer.hello",
				"GET authorization/test": "v1.authorization.hello",

				// Account
				// Account Type
				"REST account/type": "v1.accounttype",
				"POST /account/type/list": "v1.accounttype.list",

				// Account Unit
				"REST account/unit": "v1.accountunit",
				"POST /account/unit/list": "v1.accountunit.list",

				// Account Journal
				"REST account/journal": "v1.accountjournal",
				"POST /account/journal/list": "v1.accountjournal.list",
				"POST /account/transfer": "v1.accountjournal.transfer",
				"GET /account/journal/check/:id": "v1.accountjournal.check",


				// Account Posting
				"REST account/posting": "v1.accountposting",
				"POST /account/posting/list": "v1.accountposting.list",
				"GET account/posting/total": "v1.accountposting.total",


				// Account Access Rule
				"REST account/accessrule": "v1.accountaccessrule",
				"POST /account/accessrule/list": "v1.accountaccessrule.list",

				// Account 
				"REST account": "v1.account",
				"POST /account/list": "v1.account.list",
				"GET /account/amount/:accountCode": "v1.account.amount",
				"GET /account/sync/:accountCode": "v1.account.sync",

				// Account Period
				"REST account/period": "v1.accountperiod",
				"POST /account/period/list": "v1.accountperiod.list",
				"GET account/period/current": "v1.accountperiod.currentPeriod",
				"GET account/period/change": "v1.accountperiod.changePeriod",

				// Account Transaction Code
				"REST account/transactioncode": "v1.accounttransactioncode",
				"POST /account/transactioncode/list": "v1.accounttransactioncode.list",

				//Lock 
				"POST account/lock/get": "v1.accountlock.getLock",
				"POST account/lock/check": "v1.accountlock.checkLock",

				//Address 
				"REST common/address": "v1.address",
				"POST common/address/list": "v1.address.list",

				//Code 
				"REST common/code": "v1.code",
				"POST common/code/list": "v1.code.list",

				//Contact 
				"REST common/contact": "v1.contact",
				"POST common/contact/list": "v1.contact.list",

				//Geolocation 
				"REST common/geolocation": "v1.geolocation",
				"POST common/geolocation/list": "v1.geolocation.list",
				"POST common/geolocation/search": "v1.geolocation.search",

				//Inventory Category
				"REST inventory/category": "v1.inventorycategory",
				"POST inventory/category/list": "v1.inventorycategory.list",

				//Inventory SKU
				"REST inventory/sku": "v1.inventorysku",
				"POST inventory/sku/list": "v1.inventorysku.list",

				//Inventory Brand
				"REST inventory/brand": "v1.inventorybrand",
				"POST inventory/brand/list": "v1.inventorybrand.list",

				//Inventory Item
				"REST inventory/item": "v1.inventoryitem",
				"POST inventory/item/list": "v1.inventoryitem.list",

				//Inventory Supplier
				"REST inventory/supplier": "v1.inventorysupplier",
				"POST inventory/supplier/list": "v1.inventorysupplier.list",

				//Inventory Supplier Item
				"REST inventory/supplieritem": "v1.inventorysupplieritem",
				"POST inventory/supplieritem/list": "v1.inventorysupplieritem.list",

				//Inventory Supplier Contact
				"REST inventory/suppliercontact": "v1.inventorysuppliercontact",
				"POST inventory/suppliercontact/list": "v1.inventorysuppliercontact.list",

				//Inventory Stock
				"REST inventory/stock": "v1.inventorystock",
				"POST inventory/stock/list": "v1.inventorystock.list",

				//Socket
				"POST socket/echo": "v1.socket.echo",

				//Socket Event
				"REST socket/event": "v1.socketevent",
				"POST socket/event/list": "v1.socketevent.list",

				//Socket Room
				"REST socket/room": "v1.socketroom",
				"POST socket/room/list": "v1.socketroom.list",

				//Socket Room User
				"REST socket/room/user": "v1.socketroomuser",
				"POST socket/room/user/list": "v1.socketroomuser.list",
				"POST socket/room/user/invite": "v1.socketroomuser.invite",

				//Commerce Category
				"REST commerce/category": "v1.commercecategory",
				"POST commerce/category/list": "v1.commercecategory.list",

				//Commerce Customer
				"REST commerce/customer": "v1.commercecustomer",
				"POST commerce/customer/list": "v1.commercecustomer.list",

				//Commerce discount
				"REST commerce/discount": "v1.commercediscount",
				"POST commerce/discount/list": "v1.commercediscount.list",

				//Commerce info
				"REST commerce/info": "v1.commerceinfo",
				"POST commerce/info/list": "v1.commerceinfo.list",

				//Commerce order detail
				"REST commerce/order/detail": "v1.commerceorderdetail",
				"POST commerce/order/detail/list": "v1.commerceorderdetail.list",

				//Commerce order
				"REST commerce/order": "v1.commerceorder",
				"POST commerce/order/list": "v1.commerceorder.list",

				//Commerce payment
				"REST commerce/payment": "v1.commercepayment",
				"POST commerce/payment/list": "v1.commercepayment.list",

				//Commerce product info
				"REST commerce/product/info": "v1.commerceproductinfo",
				"POST commerce/product/info/list": "v1.commerceproductinfo.list",

				//Commerce product
				"REST commerce/product": "v1.commerceproduct",
				"POST commerce/product/list": "v1.commerceproduct.list",

				//Commerce shipping
				"REST commerce/shipping": "v1.commerceshipping",
				"POST commerce/shipping/list": "v1.commerceshipping.list",

				//Schedule Task
				"REST schedule/task": "v1.scheduletask",
				"POST schedule/task/list": "v1.scheduletask.list",

				//Schedule Rule
				"REST schedule/rule": "v1.schedulerule",
				"POST schedule/rule/list": "v1.schedulerule.list",

				//Schedule Task Rule
				"REST schedule/task/rule": "v1.scheduletaskrule",
				"POST schedule/task/rule/list": "v1.scheduletaskrule.list",

				//Schedule Task Param
				"REST schedule/task/param": "v1.scheduletaskparam",
				"POST schedule/task/param/list": "v1.scheduletaskparam.list",

				//Schedule Task Log
				"REST schedule/log": "v1.schedulelog",
				"POST schedule/log/list": "v1.schedulelog.list",

				//Schedule Task Log
				"REST common/ranking": "v1.commonranking",
				"POST common/ranking/list": "v1.commonranking.list",
				"GET common/ranking/total/:name": "v1.commonranking.total",

				//POS
				"REST pos/owner": "v1.posowner",
				"POST pos/owner/list": "v1.posowner.list",

				"REST pos/bill": "v1.posbill",
				"POST pos/bill/list": "v1.posbill.list",

				"REST pos/category": "v1.poscategory",
				"POST pos/category/list": "v1.poscategory.list",

				"REST pos/customer": "v1.poscustomer",
				"POST pos/customer/list": "v1.poscustomer.list",

				"REST pos/discount": "v1.posdiscount",
				"POST pos/discount/list": "v1.posdiscount.list",

				"REST pos/item": "v1.positem",
				"POST pos/item/list": "v1.positem.list",

				"REST pos/shopitem": "v1.posshopitem",
				"POST pos/shopitem/list": "v1.posshopitem.list",

				"REST pos/order": "v1.posorder",
				"POST pos/order/list": "v1.posorder.list",

				"REST pos/orderdetail": "v1.posorderdetail",
				"POST pos/orderdetail/list": "v1.posorderdetail.list",

				"REST pos/rating": "v1.posrating",
				"POST pos/rating/list": "v1.posrating.list",


				"REST pos/sale": "v1.possale",
				"POST pos/sale/list": "v1.possale.list",

				"REST pos/saledetail": "v1.possaledetail",
				"POST pos/saledetail/list": "v1.possaledetail.list",

				"REST pos/shipping": "v1.posshipping",
				"POST pos/shipping/list": "v1.posshipping.list",

				"REST pos/shop": "v1.posshop",
				"POST pos/shop/list": "v1.posshop.list",

				"REST pos/shopuser": "v1.posshopuser",
				"POST pos/shopuser/list": "v1.posshopuser.list",

				"REST pos/user": "v1.posuser",
				"POST pos/user/list": "v1.posuser.list",

				"REST pos/noti": "v1.posnoti",
				"POST pos/noti/list": "v1.posnoti.list",

				"REST pos/review": "v1.posreview",
				"POST pos/review/list": "v1.posreview.list",

				"REST pos/ranking": "v1.posranking",
				"POST pos/ranking/list": "v1.posranking.list",
				

				"POST pos/admin/account": "v1.posadmin.getaccount",
				"POST pos/admin/update/account": "v1.posadmin.updateaccount",
				"POST pos/admin/owner": "v1.posadmin.getowner",
				"POST pos/admin/add/owner": "v1.posadmin.addowner",
				"POST pos/admin/update/owner": "v1.posadmin.updateowner",

				"POST pos/admin/get/item": "v1.posadmin.getbyid",
				"POST pos/admin/items": "v1.posadmin.getitems",
				"POST pos/admin/add/item": "v1.posadmin.additem",
				"POST pos/admin/update/item": "v1.posadmin.updateitem",
				"POST pos/admin/map/items": "v1.posadmin.mapitems",

				"POST pos/front/user/login": "v1.posfrontend.userlogin",
				"POST pos/front/user/items": "v1.posfrontend.getitems",
				"POST pos/front/update/item": "v1.posfrontend.updateitem",
				"POST pos/front/get/item": "v1.posfrontend.getbyid",
				"POST pos/front/user/update": "v1.posfrontend.updateuser",
				"POST pos/front/user/changepassword": "v1.posfrontend.changepassword",
				"POST pos/front/user/resetpassword": "v1.posfrontend.resetpassword",
				"POST pos/front/user/sale": "v1.posfrontend.sale",
				"POST pos/front/user": "v1.posfrontend.user",
				"POST pos/front/user/order/process": "v1.posfrontend.orderprocess",
				"POST pos/front/get/customer": "v1.posfrontend.customer",
				"POST pos/front/get/shop": "v1.posfrontend.shop",

				"POST pos/public/account": "v1.pospublic.getaccount",
				"POST pos/public/customer": "v1.pospublic.getcustomer",
				"POST pos/public/add/customer": "v1.pospublic.addcustomer",
				"POST pos/public/update/customer": "v1.pospublic.updatecustomer",

				"POST pos/public/get/item": "v1.pospublic.getbyid",
				"POST pos/public/items": "v1.pospublic.getitems",
				"POST pos/public/find/items": "v1.pospublic.finditems",
				"POST pos/public/add/item": "v1.pospublic.additem",
				"POST pos/public/update/item": "v1.pospublic.updateitem",
				"POST pos/public/map/items": "v1.pospublic.mapitems",
				"POST pos/public/order/items": "v1.pospublic.orderitems",
				"POST pos/public/total/rank": "v1.pospublic.totalrank",
				"POST pos/socket/broadcast": "v1.possocket.broadcast",
				"POST pos/public/add/review": "v1.pospublic.addreview",
				
			},

			// https://github.com/mscdex/busboy#busboy-methods
			busboyConfig: {
				limits: {
					files: 1
				}
			},

			//mappingPolicy: "restrict"


		}],


		// Serve assets from "public" folder
		assets: {
			//folder: "public"
			folder: "upload"
		}
	},
	methods: {
		// Authorization  for route
		authorize(ctx, route, req, res) {
			ctx.meta.authorization = req.headers["authorization"];
			return Promise.resolve(ctx);
		},
		
	},
};
