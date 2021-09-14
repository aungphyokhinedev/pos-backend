"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let POSPaymentSchema = new Schema({
	uid: {
		type: Schema.Types.ObjectId, 
		ref: "ssouser",
		index: true,
		required: "User ID is required",
	},
	owner: {
		type: Schema.Types.ObjectId, 
		ref: "posowner",
		index: true,
		required: "Owner ID is required",
	},
	user: {
		type: Schema.Types.ObjectId, 
		ref: "posuser",
		index: true,
		required: "Sale User ID is required",
    },
	customer: {
		type: Schema.Types.ObjectId, 
		ref: "poscustomer",
		index: true,
    },
    shop: {
		type: Schema.Types.ObjectId, 
		ref: "posshop",
		index: true,
		required: "Shop ID is required",
    },
    transaction: {
		type: Schema.Types.ObjectId, 
		index: true,
		required: "Transaction ID is required",
    },
    type: {
		type: String,
		trim: true,
		index: true,
	},
	date: {
		type: Date, default: Date.now, index: true
	},
	status: {
		type: String,
		trim: true,
		index: true,
	},
	remark: {
		type: String,
		index: true
	},
	channel: {
		type: Schema.Types.ObjectId, 
		ref: "pospaymentchannel",
		index: true,
	},
    total: {
		type: Number,
		default: 0
	},
	deleteFlag: {
		type: Boolean, default: false, index: true
	},
}, {
	timestamps: true
});
POSPaymentSchema.index({
    "remark": "text",
});

module.exports = mongoose.model("POSPayment", POSPaymentSchema);