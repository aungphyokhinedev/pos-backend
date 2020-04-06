"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let pointSchema = require("./point.scheme.model");
let POSShopSchema = new Schema({
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
		unique : true,
		index: true,
		required: "Name is required"
	},
    description: {
		type: String,
		trim: true,
		index: true,
		required: "Description is required"
    },
    logo: {
		type: String,
		trim: true,
		index: true,
	},
    mobile: {
		type: String,
		trim: true,
		index: true,
    },
    phone: {
		type: String,
		trim: true,
		index: true,
	},
	email: {
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
    coverage: {
		type: Number, index: true
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

POSShopSchema.index({
    "name": "text",
	"description": "text",
	location: "2dsphere"
});

POSShopSchema.index({ owner:1, name:1}, { unique: true });
module.exports = mongoose.model("POSShop", POSShopSchema);