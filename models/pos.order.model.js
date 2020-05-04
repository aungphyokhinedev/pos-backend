"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let pointSchema = require("./point.scheme.model");
let POSOrderSchema = new Schema({
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
	orderNumber: {
		type: String,
		unique: true,
		trim: true,
		required: "Order No. is required",
		index: true,
	},
	orderDate: {
		type: Date, default: new Date(), index: true
	},
	shipDate: {
		type: Date,  index: true
	},
	date: {
		type: Date, default: Date.now, index: true
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
	mobile: {
		type: String,
		index: true
	},
	address: {
		type: String,
		index: true
	},
	shipping: {
		type: Schema.Types.ObjectId, 
		ref: "posshipping",
		index: true
    },
    location: {
		type: pointSchema,
		index: true
	},
	taxAmount: {
		type: Number,
		default: 0
	},
	discountAmount: {
		type: Number,
		default: 0
	},
	discount: {
		type: Schema.Types.ObjectId, 
		ref: "posdiscount",
		index: true,
	},
	tax: {
		type: Schema.Types.ObjectId, 
		ref: "postax",
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

POSOrderSchema.index({
    "name": "text",
    "orderNumber": "text",
});


POSOrderSchema.index({location: "2dsphere"});
module.exports = mongoose.model("POSOrder", POSOrderSchema);