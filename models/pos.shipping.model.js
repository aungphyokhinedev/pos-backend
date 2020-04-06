"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let pointSchema = require("./point.scheme.model");
let POSShippingSchema = new Schema({
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
	name: {
		type: String,
		trim: true,
		index: true,
		required: "Location Name is required"
    },
    location: {
		type: pointSchema,
		index: true
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
}, {
	timestamps: true
});


POSShippingSchema.index({location: "2dsphere"});
module.exports = mongoose.model("POSShipping", POSShippingSchema);