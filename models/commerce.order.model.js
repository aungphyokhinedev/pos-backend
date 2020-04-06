"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let CommerceOrderSchema = new Schema({
	uid: {
		type: Schema.Types.ObjectId, 
		ref: "ssouser",
		index: true,
		required: "User ID is required",
	},
	customer: {
		type: Schema.Types.ObjectId, 
		ref: "commercecustomer",
		index: true,
		required: "Customer ID is required",
	},
	orderNumber: {
		type: String,
		trim: true,
		index: true,
	},
	orderDate: {
		type: Date, default: new Date(), index: true
	},
	shipDate: {
		type: Date,  index: true
	},
	paymentDate: {
		type: Date,  index: true
	},
	date: {
		type: Date, default: new Date(), index: true
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
	paid: {
		type: Boolean, default: false, index: true
	},
	name: {
		type: String,
		trim: true,
		index: true,
		required: "Order Name is required"
	},
	remark: {
		type: String,
		index: true
	},
	payment: {
		type: Schema.Types.ObjectId, 
		ref: "CommercePayment",
		index: true
	},
	shipping: {
		type: Schema.Types.ObjectId, 
		ref: "CommercePayment",
		index: true
	},
	deleteFlag: {
		type: Boolean, default: false, index: true
	},
}, {
	timestamps: true
});



module.exports = mongoose.model("CommerceOrder", CommerceOrderSchema);