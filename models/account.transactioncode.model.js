"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let AccountTransactionCodeSchema = new Schema({
	uid: {
		type: Schema.Types.ObjectId, 
		ref: "ssouser",
		index: true,
		required: "User ID is required",
	},
	transactionCode: {
		type: String,
		trim: true,
		unique : true,
		index: true,
		required: "Transaction Code is required"
	},
	name: {
		type: String,
		index: true
	},
	deleteFlag: {
		type: Boolean, default: false, index: true
	},
}, {
	timestamps: true
});

// Add full-text search index
AccountTransactionCodeSchema.index({
	"name": "text",
});

module.exports = mongoose.model("AccountTransactionCode", AccountTransactionCodeSchema);