"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let CommerceShippingSchema = new Schema({
	uid: {
		type: Schema.Types.ObjectId, 
		ref: "ssouser",
		index: true,
		required: "User ID is required",
	},
	name: {
		type: String,
		trim: true,
		index: true,
		required: "Shipping Name is required"
	},
	address: {
		type: Schema.Types.ObjectId, 
		ref: "address",
		index: true,
		required: "Address ID is required",
	},
	contact: {
		type: Schema.Types.ObjectId, 
		ref: "contact",
		index: true,
		required: "Contact ID is required",
	},
}, {
	timestamps: true
});



module.exports = mongoose.model("CommerceShipping", CommerceShippingSchema);