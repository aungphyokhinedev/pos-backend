"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let CommerceOrderDetailSchema = new Schema({
	uid: {
		type: Schema.Types.ObjectId, 
		ref: "ssouser",
		index: true,
		required: "User ID is required",
	},
	order: {
		type: Schema.Types.ObjectId, 
		ref: "commerceorder",
		index: true,
		required: "Order ID is required",
	},
	product: {
		type: Schema.Types.ObjectId, 
		ref: "commerceproduct",
		index: true,
		required: "Product ID is required",
	},
	orderNumber: {
		type: String,
		trim: true,
		index: true,
	},
	price: {
		type: Number,
		default: 0
	},
	discount: {
		type: Number,
		default: 0
	},
	qty: {
		type: Number,
		default: 0
	},
	total: {
		type: Number,
		default: 0
	},
	color: {
		type: String,
		trim: true,
		index: true,
	},
	unit: {
		type: String,
		trim: true,
		index: true,
	},
	size: {
		type: String,
		default: 0
	},
	status: {
		type: String,
		trim: true,
		index: true,
	},
	orderDate: {
		type: Date, default: new Date(), index: true
	},
	shippingDate: {
		type: Date,  index: true
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



module.exports = mongoose.model("CommerceOrderDetail", CommerceOrderDetailSchema);