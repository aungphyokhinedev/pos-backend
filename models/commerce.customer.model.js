"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let CommerceCustomerSchema = new Schema({
	uid: {
		type: Schema.Types.ObjectId, 
		ref: "ssouser",
		index: true,
		required: "User ID is required",
	},
	user: {
		type: Schema.Types.ObjectId, 
		ref: "ssouser",
		index: true,
		required: "User ID is required",
	},
	contact: {
		type: Schema.Types.ObjectId, 
		ref: "contact",
	},
	billingAddress: {
		type: Schema.Types.ObjectId, 
		ref: "address",
		index: true,
	},
	shippingAddress: {
		type: Schema.Types.ObjectId, 
		ref: "address",
		index: true,
	},
	name: {
		type: String,
		trim: true,
		index: true,
		required: "Product Name is required"
	},
	date: {
		type: Date, default: new Date(), index: true
	},
}, {
	timestamps: true
});



module.exports = mongoose.model("CommerceCustomer", CommerceCustomerSchema);