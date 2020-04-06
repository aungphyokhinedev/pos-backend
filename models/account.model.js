"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let AccountSchema = new Schema({
	uid: {
		type: Schema.Types.ObjectId, 
		ref: "ssouser",
		index: true,
		required: "User ID is required",
	},
	accountCode: {
		type: String,
		trim: true,
		unique : true,
		index: true,
		required: "Name is required"
	},
	unit: {
		type: Schema.Types.ObjectId, 
		ref: "AccountUnit",
		required: "Unit is required",
		index: true
	},
	type: {
		type: Schema.Types.ObjectId, 
		ref: "accounttype",
		index: true,
		required: "Account Type is required",
	},
	rule: {
		type: Schema.Types.ObjectId, 
		index: true,
		ref: "AccountAccessRule",
	},
	name: {
		type: String,
		index: true,
	},
	amount: {
		type: Number,
		default: 0,
	},
	blocked: {
		type: Boolean, default: false, index: true
	},
	locked: {
		type: Boolean, default: false, index: true
	},
	deleteFlag: {
		type: Boolean, default: false, index: true
	},
}, {
	timestamps: true
});

// Add full-text search index
AccountSchema.index({
	"name": "text",
	"accountCode": "text"
});

module.exports = mongoose.model("Account", AccountSchema);