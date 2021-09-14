"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let POSShopUserSchema = new Schema({
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
	name: {
		type: String,
		trim: true,
		index: true,
		required: "Name is required"
	},
    shop: {
		type: Schema.Types.ObjectId, 
		ref: "posshop",
		index: true,
		required: "Shop ID is required",
    },
    user: {
		type: Schema.Types.ObjectId, 
		ref: "posuser",
		index: true,
		required: "User ID is required",
    },
}, {
	timestamps: true
});
POSShopUserSchema.index({ owner:1, name:1}, { unique: true });
POSShopUserSchema.index({ owner:1, shop:1, user: 1}, { unique: true });
module.exports = mongoose.model("POSShopUser", POSShopUserSchema);