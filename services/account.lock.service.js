
"use strict";

const DbService = require("moleculer-db");
const authorizationMixin = require("../mixin/authorization.mixin");
const queryMixin = require("../mixin/query.mixin");
const redLock = require("../common/red.lock.helper");

function timeout(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
	name: "accountlock",
	version: 1,
	mixins: [DbService, authorizationMixin, queryMixin],
	//collection: "users",
	/**
	 * Service settings
	 */
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

			return "Hello Lock";
		},
		getLock: {
			params: {
				resources: "string",
				duration: "string"
			},
			async handler(ctx) {
				const _resources = ctx.params.resources.split(",");
				console.log(_resources);
				redLock.retryCount = 1000; 
				await redLock.lock(_resources, 30000).then(async function (lock) {
                    
					console.log( ctx.params.resources + " is lock on ");
					await timeout(ctx.params.duration);
					console.log(ctx.params.resources + " is lock off");
					return lock.unlock()
						.catch(function (err) {
							console.log(ctx.params.name + " is on error");
							console.error(err);
						});
				});
				return "locking done";
			}

		},
		checkLock: {
			params: {
				resources: "string",
			},
			async handler(ctx) {
				const _resources = ctx.params.resources.split(",");
				redLock.retryCount = 0;
				return await redLock.lock(_resources, 1000).then((lock) => {
					lock.unlock();
					return "No lock on " + ctx.params.resources;
				}).catch(() => {
					return "Lock on " + ctx.params.resources;
					
				});
			}

		},
	},
	hooks: {
		before: {
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