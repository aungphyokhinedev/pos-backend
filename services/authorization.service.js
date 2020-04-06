
"use strict";

const { ForbiddenError } = require("moleculer-web").Errors;

module.exports = {
	name: "authorization",
	version: 1,
	mixins: [],


	//collection: "users",
	/**
	 * Service settings
	 */
	settings: {
		failLimit: 5
	},
	dependencies: [
		{ name: "auth", version: 1 },
		{ name: "accessrule", version: 1 },
		{ name: "usergroup", version: 1 },
		{ name: "rule", version: 1 },
		{ name: "permission", version: 1 },
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

			return "Hello Authorization";
		},
		getAuthorizationToken: {
			params: {
				data: "object",
			},
			async handler(ctx) {
				return await ctx.call("v1.jwt.signToken", {
					data: {
						_id:ctx.params.data._id,
						token:ctx.params.data.token
					}
				});
			}
		},
		resolveToken: {
			params: {
				jwtToken: "string",
			},
			async handler(ctx) {
				const _data = await ctx.call("v1.jwt.verifyToken", { token: ctx.params.jwtToken });
				return _data;
			}
		},
		getRules: {
			params: {
				userid: "string",
				service: "string",
				application: "string",
			},
			async handler(ctx) {
				return await this.getSSORules(ctx);	
			}
		},
		getAccess: {
			params: {
				userid: "string",
				service: "string",
				application: "string",
			},
			async handler(ctx) {
			
				return await this.getSSOAccess(ctx);	
			}
		},
		

	},
	hooks: {
		after: {
			// Define a global hook for all actions to remove sensitive data
			"*": (ctx, res) => {
				if(typeof res === "object" && !res.code){
					res.code = 200;
				}
				return res;
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

		async getSSORules(ctx) {
			const _groups = await ctx.call("v1.permission.find", {  query:{ user :  ctx.params.userid}});
			
			let _accessRules = [];
			for (const element of _groups) {

				let _query = {userGroup : element.userGroup};

				if(ctx.params.application != "*"){
					//getting application id
					const _application = await ctx.call("v1.application.find", { query:{ name: ctx.params.application } });
					if(!_application[0]){
						throw new ForbiddenError("Invalid Application");
					}
					_query.application = _application[0]._id;
				}

				if(ctx.params.service != "*"){
					//getting service id
					const _service = await ctx.call("v1.service.find", { query:{ name: ctx.params.service } });
					if(!_service[0]){
						throw new ForbiddenError("Invalid Service");
					}
					_query.service = _service[0]._id;
				}
				
				const _accessrule = await ctx.call("v1.accessrule.find", { query: _query });
				_accessRules = _accessRules.concat(_accessrule);
			}	

			let _rules = [];
			for (const element of _accessRules) {
				const _rule = await ctx.call("v1.rule.get", { id: element.rule + "" });
				
				_rules.push(_rule);
			}
			return _rules;
		},
		async getSSOAccess(ctx) {
			const _rules = await this.getSSORules(ctx);
			
			let _create,_read,_update,_delete = false;
			_rules.forEach(element=>{
				_create = element.create || _create;
				_read = element.read || _read;
				_update = element.update || _update;
				_delete = element.delete || _delete;
			});
			return {
				create:_create,read:_read,update:_update,delete:_delete 
			};
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