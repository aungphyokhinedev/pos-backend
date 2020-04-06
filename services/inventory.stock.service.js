
"use strict";

const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const settings = require("../config/settings.json");
const inventoryStockModel = require("../models/inventory.stock.model");
const authorizationMixin = require("../mixin/authorization.mixin");
const queryMixin = require("../mixin/query.mixin");
const { aggregate } = require("../common/mongo.aggregate.helpers");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const redLock = require("../common/red.lock.helper");
const transactionHelper = require("../common/mongo.transaction.helper");
module.exports = {
	name: "inventorystock",
	version: 1,
	mixins: [DbService, authorizationMixin, queryMixin],

	adapter: new MongooseAdapter(process.env.MONGO_URI || settings.mongo_uri, { "useUnifiedTopology": true }),
	model: inventoryStockModel,

	//collection: "users",
	/**
	 * Service settings
	 */
	settings: {
		failLimit: 5,
		populates: {
			"uid": {
				action: "v1.auth.get",
				params: {
					fields: "email _id"
				}
			},
			"type": {
				action: "v1.code.get",
				params: {
					fields: "name _id"
				}
			},
			"item": {
				action: "v1.inventoryitem.get",
				params: {
					fields: "name _id"
				}
			},
		}
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

			return "Hello Inventory Stock";
		},
		create: {
			params: {
				item: "string",
				qty: "number"
			},
			async handler(ctx) {
				const _item = await ctx.call("v1.inventoryitem.get",{ id: ctx.params.item });
				if(!_item) throw "Invalid Item";

			
				redLock.retryCount = settings.lock_try_count;
				let _locks = [];
				if (ctx.params.lockItem) {
					_locks.push("inventory.lock." + ctx.params.item);
				}
				return await transactionHelper(this.adapter.uri, settings.account_run_with_transaction, async function (db, opts) {
					return await redLock.lock(_locks, 1000).then(async (lock) => {

						const _total = await this.getTotal(ctx);

						if (ctx.params.qty + _total >= 0) {
							const _newstock = {
								item: ctx.params.item,
								qty: ctx.params.qty,
								name: ctx.params.name,
								uid: ctx.params.uid,
							};
							const _createds = await db.collection("inventorystocks").insertOne(_newstock, opts);
							await db.collection("inventoryitems").updateOne({ _id: ObjectId(ctx.params.item) }, { $inc: { unitInStock: ctx.params.qty } },opts);

							//if there is no supplier nothing will do
							if(ctx.params.supplier){
							
								const _item = await db.collection("inventorysupplieritems").findOne({supplier: ObjectId(ctx.params.supplier), item:  ObjectId(ctx.params.item)});
								if(!_item) throw "Supplier will not supply this item";
								const _value = _item.standardPrice * ctx.params.qty;
								await db.collection("inventorysupplieritems").updateOne({ _id: _item._id }, { $inc: { totalQty: ctx.params.qty, totalValue: _value } },opts);
							}

							lock.unlock().catch(function (err) {
								console.error(err);
							});
							return _createds;
						}
						else {
							lock.unlock().catch(function (err) {
								console.error(err);
							});
							throw "Out of stock [" + ctx.params.item + "]";
						}

					});

				}.bind(this));


			}

		}
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
		async getTotal(ctx) {
			const _data = await aggregate({
				uri: this.adapter.uri,
				collection: "inventorystocks",
				match: { item: new ObjectId(ctx.params.item), deleteFlag: false },
				group: { _id: null, total: { $sum: "$qty" } }

			});
			return _data ? _data.total : 0;

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