"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let CommerceProductInfoSchema = new Schema({
	uid: {
		type: Schema.Types.ObjectId, 
		ref: "ssouser",
		index: true,
		required: "User ID is required",
	},
	product: {
		type: Schema.Types.ObjectId, 
		ref: "commerceproduct",
		index: true,
		required: "Product is required",
	},
	info: {
		type: Schema.Types.ObjectId, 
		ref: "commerceinfo",
		index: true,
		required: "Specification is required",
	},
	name: {
		type: String,
		index: true
	},
}, {
	timestamps: true
});



module.exports = mongoose.model("CommerceProductInfo", CommerceProductInfoSchema);