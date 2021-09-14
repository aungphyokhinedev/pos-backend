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
				/*
				//Test Crypto
				"POST /crypto/hash": "v1.crypto.hashedPassword",
				"POST /crypto/validate": "v1.crypto.validatePassword",
	*/
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
				
				"POST pos/admin/login/sale": "v1.posadmin.saleLogin",
				"POST pos/admin/account": "v1.posadmin.getaccount",
				"POST pos/admin/update/account": "v1.posadmin.updateaccount",
				"POST pos/admin/owner": "v1.posadmin.getowner",
				"POST pos/admin/add/owner": "v1.posadmin.addowner",
				"POST pos/admin/update/owner": "v1.posadmin.updateowner",

				"POST pos/admin/get/item": "v1.posadmin.getbyid",
				"POST pos/admin/items": "v1.posadmin.getitems",
				"POST pos/admin/distinct/items": "v1.posadmin.findDistinct",
				"POST pos/admin/add/item": "v1.posadmin.additem",
				"POST pos/admin/update/item": "v1.posadmin.updateitem",
				"POST pos/admin/map/items": "v1.posadmin.mapitems",

				"POST pos/admin/summary/sale": "v1.posadmin.salesummary",
				"POST pos/admin/top/sale": "v1.posadmin.saletop",
				"POST pos/admin/summary/saledetail": "v1.posadmin.saledetailsummary",
				"POST pos/admin/top/saledetail": "v1.posadmin.saledetailtop",
				"POST pos/admin/summary/order": "v1.posadmin.ordersummary",
				"POST pos/admin/summary/orderdetail": "v1.posadmin.orderdetailsummary",

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
				"POST pos/front/add/order/info": "v1.posfrontend.addorderinfo",
				"POST pos/front/get/invoice": "v1.posfrontend.getinvoice",
				"POST pos/front/delete/sale": "v1.posfrontend.deletesale",
				"POST pos/front/get/sale": "v1.posfrontend.getsale",
				"POST pos/front/emit": "v1.posfrontend.emitevent",

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
				"POST pos/public/order/cancel": "v1.pospublic.ordercancel",
				"POST pos/public/total/rank": "v1.pospublic.totalrank",
				"POST pos/socket/broadcast": "v1.possocket.broadcast",
				"POST pos/public/add/review": "v1.pospublic.addreview",
				"POST pos/public/set/favourite": "v1.pospublic.setfavourite",
				"POST pos/public/get/offer": "v1.pospublic.getoffer",
				"POST pos/public/claim/invoice": "v1.pospublic.invoiceclaim",
				
			},

			// https://github.com/mscdex/busboy#busboy-methods
			busboyConfig: {
				limits: {
					files: 1
				}
			},

			//mappingPolicy: "restrict"


		}],

		//this one should be change public for VPS
		// Serve assets from "public" folder
		assets: {
			folder: "public" ///for production docker 
			//folder: "upload" ///for local server
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
