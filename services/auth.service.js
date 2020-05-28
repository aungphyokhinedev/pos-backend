
"use strict";

const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const { ForbiddenError } = require("moleculer-web").Errors;
const settings = require("../config/settings.json");
const ssouserModel = require("../models/ssouser.model");
const authorizationMixin = require("../mixin/authorization.mixin");
require("events").EventEmitter.prototype._maxListeners = 100;
module.exports = {
	name: "auth",
	version: 1,
	mixins: [DbService,authorizationMixin],

	adapter: new MongooseAdapter(process.env.MONGO_URI || settings.mongo_uri, { "useUnifiedTopology": true }),
	model: ssouserModel,
	//collection: "users",
	/**
	 * Service settings
	 */
	settings: {
		fields: ["_id", "email", "provider", "userName","photoUrl","locked","blocked", "token", "createdAt",
			"createdAt","updatedAt","lastSucessfullLoggedInDate","lastLoggedInDate",
			"lastPasswordChange" ],
		failLimit: 5
	},
	dependencies: [
		{ name: "facebook", version: 1 },
		{ name: "google", version: 1 },
		{ name: "mailer", version: 1 },
		{ name: "jwt", version: 1 },
		{ name: "crypto", version: 1 },
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

			return "Hello Auth";
		},
		getByIds: {
			async handler(ctx) {
				let data = [];	
				
				for(let uid of ctx.params.id){
					try{
						let user = await ctx.call("v1.auth.get", {id:uid});
						data.push({email:user.email,_id:user._id});
					}catch(e){
						console.log(e);
					}
				}
				return data;
			}
		},
		internalRegister: {
			params: {
				email: "string",
				provider: "string",
				password: "string",
			},
			async handler(ctx) {
				if(ctx.params.provider != "internal"){
					return new ForbiddenError("Invalid provider");
				}

				let _user = {
					name: ctx.params.name,
					email:ctx.params.email,
					provider: ctx.params.provider,
				};
				_user.password = await ctx.call("v1.crypto.hashedPassword",{data:ctx.params.password,saltRounds:10});			
				return await  ctx.call("v1.auth.create",_user);
			}
		},
		socialRegister: {
			params: {
				token: "string",
				provider: "string",
			},
			async handler(ctx) {
			
				let _login;
				//for facebook login
				if (ctx.params.provider == "facebook") {
					_login = await ctx.call("v1.facebook.login", {
						token: ctx.params.token
					});
				}
				//for google login
				else if (ctx.params.provider == "google") {
					_login = await ctx.call("v1.google.login", {
						token: ctx.params.token,
					});
				}
				else{
					return new ForbiddenError("Invalid provider");
				}

				if (_login.success) {


					// checking email is already used
					const _existinguser = await this.findByEmail(_login.data.email);
		
					if(_existinguser){
						return this.setLogin(ctx,_existinguser);	
					}
					else {
						//generating random password
						const _randompassword = await ctx.call("v1.crypto.generatePassword", {length:7});
						//hashing password
						_login.data.password = await ctx.call("v1.crypto.hashedPassword",{data:_randompassword,saltRounds:10});	
						
						if(_login.data.photoUrl){
							const _file = await  ctx.call("v1.file.download",{
								url: _login.data.photoUrl
							});
							_login.data.photoUrl = _file;
							console.log("file name", _file);
						}

						const _user = await  ctx.call("v1.auth.create",_login.data);
						return this.setLogin(ctx,_user);
						
					}
					
				}
				else{
					return new ForbiddenError(_login.message);
				}

			}
		},
		register: {
			params: {
				email: "string",
				provider: "string",
			},
			async handler(ctx) {
				console.log(ctx.params);
				let _login;
				if (ctx.params.provider == "local"){
					_login = {
						success: true,
						data: {
							email: ctx.params.email,
							provider: "local"
						}
					};
				}
				else{
					return new ForbiddenError("Invalid provider");
				}

				if (_login.success) {
					// checking email is already used
					const _existinguser = await this.findByEmail(_login.data.email);
					
					if(_existinguser){
						return new ForbiddenError("Email is already used.");
						
					}
					else {
						//generating random password
						const _randompassword = await ctx.call("v1.crypto.generatePassword", {length:7});
						//hashing password
						_login.data.password = await ctx.call("v1.crypto.hashedPassword",{data:_randompassword,saltRounds:10});			
						
						//sending with email
						await ctx.call("v1.mailer.send", {
							to:_login.data.email,
							subject:"Registeration done",
							html: "Your login password is " + _randompassword
						});
						return await  ctx.call("v1.auth.create",_login.data);
						
					}
					
				}
				else{
					return new ForbiddenError(_login.message);
				}

			}
		},
		sendResetCode: {
			params: {
				email: "string"
			},
			async handler(ctx) {
				const _user = await this.findByEmail(ctx.params.email);
				if (_user) {
					//generating random passwordd
					const _randompassword = await ctx.call("v1.crypto.generatePassword", { length: 7 });
					//send with email
					await ctx.call("v1.mailer.send", {
						to: _user.email,
						subject: "Reset Password",
						html: "Your new password is " + _randompassword
					});
					//hasing password
					const _resetPassword = await ctx.call("v1.crypto.hashedPassword", { data: _randompassword, saltRounds: 10 });
					//saving password
					const _result = await this.updateById(_user._id,{ resetPassword: _resetPassword });
					return {email: _result.email ,message: "Reset code has been sent"};

				}
				else {
					return new ForbiddenError("Invalid Email");
				}


			}
		},
		resetPassword: {
			params: {
				email: "string",
				resetCode: "string",
				newPassword: "string",
			},
			async handler(ctx) {
				let _user = await this.findByEmail(ctx.params.email);
				if (_user) {
					if(!_user.resetPassword){
						return new ForbiddenError("Reset code expired");
					}

					//checking reset code (from mail)
					let _valid = await ctx.call("v1.crypto.validatePassword", { data: ctx.params.resetCode, encrypted: _user.resetPassword });
					if (_valid) {

						//hashing password
						const _newPassword = await ctx.call("v1.crypto.hashedPassword", { data: ctx.params.newPassword, saltRounds: 10 });
						//saving password
						const _result = await this.updateById(_user._id,{ password: _newPassword,resetPassword: undefined });
						return {email: _result.email,message:"Password has been changed"};
					}
					else {
						return new ForbiddenError("Invalid reset code");
					}
				}
				else {
					return new ForbiddenError("Invalid User");
				}
			}
		},
		changePassword: {
			params: {
				currentPassword: "string",
				newPassword: "string",
			},
			async handler(ctx) {
				console.log(ctx.params);
				let _user = await this.getById(ctx.params.uid);
				if (_user) {
					
					//checking current password
					let _valid = await ctx.call("v1.crypto.validatePassword", { data: ctx.params.currentPassword, encrypted: _user.password });
					if (_valid) {

						//hashing new password
						const _newPassword = await ctx.call("v1.crypto.hashedPassword", { data: ctx.params.newPassword, saltRounds: 10 });
						//saving new password
						
						await this.adapter.updateById(ctx.params.uid, { password: _newPassword, lastPasswordChange: Date.now() });
						return {message:"Password has been changed"};
					}
					else {
						return new ForbiddenError("Invalid password");
					}
				}
				else {
					return new ForbiddenError("Invalid User");
				}
			}
		},
		socialLogin: {

			params: {
				token: "string",
				provider: "string",
			},
			async handler(ctx) {

				let _login;
				if(ctx.params.provider == "google"){
					_login = await ctx.call("v1.google.login", {
						token: ctx.params.token
					});
				}
				if(ctx.params.provider == "facebook"){
					_login = await ctx.call("v1.facebook.login", {
						token: ctx.params.token
					});
				}

				// check thrid party login result
				if(_login && _login.success){
					const _user = await this.findByEmail(_login.data.email);
					if(_user){

						//check user status
						const _error = await this.checkStatus(_user);
						if(_error) {
							return _error;
						}
						return this.setLogin(ctx,_user);
					}
					else{
						return new ForbiddenError("User is not registered");
					}
				}
				else{
					return new ForbiddenError(_login.message);
				}
			}
		},
		login: {

			params: {
				email: "string",
				password: "string",
			//	provider: "string",
			},
			async handler(ctx) {

				//get user by email
				const _user = await this.findByEmail(ctx.params.email);
				if (_user) {

					// check user status
					const _error = await this.checkStatus(_user);
					if(_error) {
						return _error;
					}

					// check password
					const _valid = await ctx.call("v1.crypto.validatePassword", { data: ctx.params.password, encrypted: _user.password });
					if (_valid) {
						return this.setLogin(ctx,_user);
					}
					else {
						return new ForbiddenError("Authentication fail(Invalid Password)");
					}
				}
				else {
					return new ForbiddenError("Authentication fail(Invalid User)");
				}
				
			}
		},
		logout: {
			async handler(ctx) {
			
				const _random = await ctx.call("v1.crypto.generatePassword", { length: 7 });			
				await this.adapter.updateById(ctx.params.uid, { token: _random});
			}
		}
	},
	hooks: {
		before: {
			"*": [],
			create: [],
			changePassword: ["checkOwner"],
			logout: ["checkOwner"],
			remove: ["checkUserRole", "checkOwner"]
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
		async updateById(id,data) {
			return await this.adapter.updateById(id, data);
		},
		findByEmail(email) {
			return this.adapter.findOne({ email });
		},
		getById(_id) {
			return this.adapter.findOne({ _id });
		},
		async getToken(ctx,data) {
			return await ctx.call("v1.authorization.getAuthorizationToken", {
				data
			});
		},
		async checkStatus(user) {
			if(user.blocked){
				return new ForbiddenError("User is blocked");
			}
		},
		async setLogin(ctx,user) {
		
			//generate token on userid and random token
			const _token = await this.getToken(ctx,user);
			await this.adapter.updateById(user._id, { lastLoggedInDate: Date.now()});
			// eslint-disable-next-line require-atomic-updates
			ctx.meta.$responseHeaders = {
				"accessToken": _token
			};

			return {
				_id:user._id,
				email:user.email,
				provider:user.provider,
				userName:user.userName
			};
		}
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