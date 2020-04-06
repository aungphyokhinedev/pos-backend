
"use strict";

const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const settings = require("../config/settings.json");
const accountJournalModel = require("../models/account.journal.model");
const authorizationMixin = require("../mixin/authorization.mixin");
const transactionHelper = require("../common/mongo.transaction.helper");
const queryMixin = require("../mixin/query.mixin");
const tranType = require("../common/trantype");
const redLock = require("../common/red.lock.helper");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const {aggregate} = require("../common/mongo.aggregate.helpers");
module.exports = {
	name: "accountjournal",
	version: 1,
	mixins: [DbService, authorizationMixin, queryMixin],

	adapter: new MongooseAdapter(process.env.MONGO_URI || settings.mongo_uri, { "useUnifiedTopology": true, replicaSet: "rs" }),
	model: accountJournalModel,

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
			"unit": {
				action: "v1.accountunit.get",
				params: {
					fields: "unitCode _id"
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

			return "Hello Account Journal";
		},
		check: {
			params: {
				id: "string",
			},
			async handler(ctx) {

				return await this.getJournalAmount(ctx.params.id);


			}
		},

		transfer: {
			params: {
				correlationID: "string",
				transactionCode: "string",
				unit: "string",
				data: "array"
			},
			async handler(ctx) {
				return this.transferAmount(ctx);

			}
		},
		
		remove: {
			async handler(ctx) {
				await this.deletePostings(ctx.params.id);
				return await this.adapter.updateById(ctx.params.id, {
					deleteFlag: true
				});
			}
		}
	},
	hooks: {
		before: {
			"*": ["checkOwner"],
			list: ["hideDelete"]
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
		async deletePostings(journal) {
			return await transactionHelper(this.adapter.uri, false, async function (db, opts) {
				return await db.collection("accountpostings").updateMany({ "journal": ObjectId(journal) }, { $set: { "deleteFlag": true } });
			});
		},
		async transferAmount(ctx) {
		
			//checking lock options
			const _noLock = ctx.params.excludeLocks && ctx.params.excludeLocks.indexOf("*") >= 0;
			redLock.retryCount = settings.lock_check_count;

			if(!_noLock) {
				await redLock.lock(settings.account_lock, 100).then((lock) => {
					return lock.unlock();
				}).catch((e) => {
					console.log(e);
					throw "Services Busy";
				});
			}
			


			//check transaction code
			const _transactionCode = await this.getTransactionCode(ctx, ctx.params.transactionCode);
			if (_transactionCode.length == 0) throw "Invalid transaction code";

			//check unit code
			const _unitInfo = await this.getUnit(ctx, ctx.params.unit);
			if (_unitInfo.length == 0) throw "Invalid account unit";
			const _unit = _unitInfo[0];

			//remove duplicate account
			const _accountCodes = ctx.params.data.reduce((_items, _item) => {
				if (_items.indexOf(_item.account) < 0) _items.push(_item.account);
				return _items;
			}, []);

			let _accountLocks =  [];
			
			//if there is some exclude on locking
			if(ctx.params.excludeLocks){
				if(_noLock) {
					_accountLocks = [];
				}else{
					_accountLocks = _accountCodes.reduce((_items,_item)=>{
						if(ctx.params.excludeLocks.indexOf(_item) < 0){
							_items.push(_item);
						}
						return _items;
					},[]);
				}
				
			}
			//adding prefix on lock keys
			_accountLocks =  _accountLocks.map(x => "account.lock." + x);

			const _period = await ctx.call("v1.accountperiod.currentPeriod");
			if (_period.length == 0) throw "Invalid Period";

			return await transactionHelper(this.adapter.uri, settings.account_run_with_transaction, async function (db, opts) {
				//locked all accounts to hold limits
				//setting lock try count
				redLock.retryCount = settings.lock_try_count;
				return await redLock.lock(_accountLocks, 1000).then(async (lock) => {

					//getting account balance shoud be kept in lock
					//getting account info and balances
					const _accounts = await this.getAccounts(ctx, _accountCodes);

					//check posting information
					const _doPosts = await this.checkPosts(ctx, _accounts);
					//check post transaction should be done or not
					await this.checkAccounts(ctx, _accounts, _doPosts, _unit);

					//check all account is valid
					if (_accounts.length != _accountCodes.length) throw "Invalid Accounts";
					const _journal = {
						correlationID: ctx.params.correlationID,
						unit: ObjectId(_unit._id),
						transactionCode: ctx.params.transactionCode,
						transactionDate: ctx.params.transactionDate || Date.now(),
						narration: ctx.params.narration,
						uid: ctx.params.uid,
						date: new Date(),
					};

					const _created = await db.collection("accountjournals").insertOne(_journal, opts);
					if (_created) {
						let _toPosts = [];

						for (const _post of _doPosts) {
							let _posting = {
								account: ObjectId(_post.account),
								journal: _created.insertedId,
								unit: ObjectId(_unit._id),
								amount: _post.amount,
								uid: ctx.params.uid,
								accountPeriod: _period[0].serial,
								deleteFlag: false,
								narration: _post.narration,
								date: new Date(),
							};
							_toPosts.push(_posting);

						}
						const _createds = await db.collection("accountpostings").insertMany(_toPosts, opts);

						await this.updateBalances(db, _doPosts, _accounts,opts);
						lock.unlock().catch(function (err) {
							console.error(err);
						});


						return _createds;

					}
					else {
						lock.unlock();
						throw "Journal creation fail";
					}
				}).catch((e) => {
					throw e;
				}).bind(this);


			}.bind(this));



		},
		async updateBalances(db, posts, accounts,opts) {
			for (const _account of accounts) {
				const _total = posts.reduce(function (total, data) {
					if (data.account == _account._id) {
						total += data.amount;
					}
					return total;
				}, 0);

				//updating should use inc instead of set for consistency
				await db.collection("accounts").updateOne({ _id: ObjectId(_account._id) }, { $inc: { amount: _total } },opts);
			}
		},
		async checkAccounts(ctx, accounts, posts, unit) {
			for (const _account of accounts) {
				if (_account.blocked) throw "Account has been blocked " + _account.accountCode;
				if (_account.locked) throw "Account has been locked " + _account.accountCode;
				if (_account.unit != unit._id) throw "Invalid unit for " + _account.accountCode;

				if (!_account.rule && !settings.account_allow_no_rule) throw "No access rule on " + _account.accountCode;

				//if rule exist need to check
				if (_account.rule) {
					const _rule = await ctx.call("v1.accountaccessrule.get", { id: _account.rule + "" });
					if (!_rule) throw "Invalid rule";
					const _posts = posts.reduce(function (posts, data) {
						if (data.account == _account._id) {
							posts.push(data);
						}
						return posts;	// eslint-disable-next-line require-atomic-updates
					}, []);


					const _total = _posts.reduce(function (total, data) {
						total += data.amount;
						return total;
					}, 0);

					const _finalAmount = _total + _account.amount;
				
					//checking lower limit
					const _lowerLimit = _rule.lowerLimit ? _rule.lowerLimit : settings.account_lower_limit;
					if (_finalAmount < _lowerLimit) throw "Insufficient balance " + _account.accountCode;

					//checking upper limit
					const _upperLimit = _rule.upperLimit ? _rule.upperLimit : settings.account_upper_limit;
					if (_finalAmount > _upperLimit) throw "Exceed balance " + _account.accountCode;


					for (const _post of _posts) {
						//checking can debit/credit
						if (!_rule.canDebit) {
							if (this.getCreditOrDebit(_post.amount) == tranType.DEBIT) throw "Cannot debit on " + _account.accountCode;
						}
						if (!_rule.canCredit) {
							if (this.getCreditOrDebit(_post.amount) == tranType.CREDIT) throw "Cannot credit on " + _account.accountCode;
						}
						if (_rule.isPrivate) {
							//.....
						}
					}


				}




			}

		},
		async getJournalAmount(journalId) {
			const _data = await aggregate({
				uri:this.adapter.uri,
				collection: "accountpostings",
				match: {journal: ObjectId(journalId), deleteFlag: false},
				group: {_id: null, total: { $sum: "$amount" } } 

			});
			return _data ? _data : {
				total: 0
			};

		},

		async checkPosts(ctx, accounts) {
			let _toPosts = [];
			let _total = 0;
			for (const post of ctx.params.data) {
				if (!post.type) throw "Transfer type is required";
				if (post.type != "C" && post.type != "D") "Invalid Type must be [C/D]";

				if (!post.amount) throw "Amount is required";
				if (typeof post.amount  != "number" || post.amount < 0) throw "Amount must be positive number";
				
				post.amount = post.type == "C" ? (post.amount * -1) : post.amount;
				_total += post.amount;

				const _account = accounts.filter(account => account.accountCode == post.account)[0];
				if (!_account) throw "Invalid transaction";



				// eslint-disable-next-line require-atomic-updates
				post.account = _account._id;
				_toPosts.push(post);
			}

			//check transaction is balanced

			if (_total != 0) throw "Transaction is not balance";

			return _toPosts;
		},

		async getUnit(ctx, unitCode) {
			return await ctx.call("v1.accountunit.find", { query: { unitCode } });
		},

		async getTransactionCode(ctx, transactionCode) {
			return await ctx.call("v1.accounttransactioncode.find", { query: { transactionCode } });
		},
		async getAccounts(ctx, accounts) {
			let _result = [];
			for (const accountCode of accounts) {
				const data = await ctx.call("v1.account.find", { query: { accountCode } });
				_result.push(...data);
			}
			return _result;
		},
		getCreditOrDebit(amount) {
			return amount > 0 ? tranType.DEBIT : tranType.CREDIT;
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