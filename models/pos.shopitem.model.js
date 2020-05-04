"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let POSShopItemSchema = new Schema({
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
    item: {
		type: Schema.Types.ObjectId, 
		ref: "POSitem",
		index: true,
		required: "Item ID is required",
	},
    shop: {
		type: Schema.Types.ObjectId, 
		ref: "posshop",
        index: true,
        required: "Shop ID is required",
    },
	name: {
		type: String,
		trim: true,
		index: true,
		required: "Name is required"
	},
    description: {
		type: String,
		trim: true,
		index: true,
		required: "Description is required"
    },
    unitPrice: {
		type: Number,
		default: 0
	},
    unit: {
		type: String,
		trim: true,
		index: true,
    },
    discount: {
		type: Schema.Types.ObjectId, 
        ref: "POSDiscount",
        index: true,
    },
	photo: {
		type: String,
		trim: true,
		index: true,
	},
	disable: {
		type: Boolean, default: false, index: true
	},
    deliveryCharge: {
		type: Number,
		default: 0
	},
	deleteFlag: {
		type: Boolean, default: false, index: true
	},
}, {
	timestamps: true
});

POSShopItemSchema.index({
    "name": "text",
    "description": "text",
});



module.exports = mongoose.model("POSShopItem", POSShopItemSchema);