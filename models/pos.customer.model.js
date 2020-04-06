"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let pointSchema = require("./point.scheme.model");
let POSCustomerSchema = new Schema({
	uid: {
		type: Schema.Types.ObjectId, 
		ref: "ssouser",
		index: true,
		required: "User ID is required",
	},
	customer: {
		type: Schema.Types.ObjectId, 
		ref: "ssouser",
		index: true,
		required: "Customer ID is required",
    },
    customerId: {
		type: String,
		unique: true,
		index: true,
		required: "Customer Code is required"
    },
	name: {
		type: String,
		trim: true,
		index: true,
		required: "Customer Name is required"
	},
	gender: {
		type: String,
		trim: true,
		index: true,
	},
	dob: {
		type: Date, default: new Date(), index: true
	},
    photo: {
		type: String,
		trim: true,
		index: true,
	},
    mobile: {
		type: String,
		trim: true,
		index: true,
    },
	address: {
		type: String,
		trim: true,
		index: true,
    },
    location: {
		type: pointSchema,
		index: true
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


POSCustomerSchema.index({location: "2dsphere"});
module.exports = mongoose.model("POSCustomer", POSCustomerSchema);