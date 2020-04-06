"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let POSOrderDetailSchema = new Schema({
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
	customer: {
		type: Schema.Types.ObjectId, 
		ref: "poscustomer",
		index: true,
		required: "Customer ID is required",
    },
    shop: {
		type: Schema.Types.ObjectId, 
		ref: "posshop",
		index: true,
		required: "Shop ID is required",
	},
	order: {
		type: Schema.Types.ObjectId, 
		ref: "POSorder",
		index: true,
		required: "Order ID is required",
	},
	item: {
		type: Schema.Types.ObjectId, 
		ref: "POSitem",
		index: true,
		required: "Item ID is required",
	},
	orderNumber: {
		type: String,
		trim: true,
		index: true,
	},
	qty: {
		type: Number,
		default: 0
	},
	total: {
		type: Number,
		default: 0
	},
	status: {
		type: String,
		trim: true,
		index: true,
	},
	errorLoc: {
		type: String,
		trim: true,
		index: true,
	},
	errorMsg: {
		type: String,
		trim: true,
		index: true,
	},
	fullfilled: {
		type: Boolean, default: false, index: true
	},
	date: {
		type: Date, default: new Date(), index: true
	},
	name: {
		type: String,
		trim: true,
		index: true,
		required: "Order Detail Name is required"
	},
	remark: {
		type: String,
		index: true
	},
	deleteFlag: {
		type: Boolean, default: false, index: true
	},
}, {
	timestamps: true
});
POSOrderDetailSchema.index({
    "name": "text",
    "orderNumber": "text",
});



module.exports = mongoose.model("POSOrderDetail", POSOrderDetailSchema);