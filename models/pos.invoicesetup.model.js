"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let POSInvoicesetupSchema = new Schema({
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
    shop: {
		type: Schema.Types.ObjectId, 
		ref: "posshop",
        index: true,
    },
	bannerPhoto: {
		type: String,
		trim: true,
		index: true,
    },
    footerPhoto: {
		type: String,
		trim: true,
		index: true,
	},
	name: {
		type: String,
		trim: true,
		unique : true,
		index: true,
		required: "Name is required"
	},
    height: {
		type: Number,
		default: 0
    },
    width: {
		type: Number,
		default: 0
    },
    fontSize: {
		type: Number,
		default: 0
	},
	deleteFlag: {
		type: Boolean, default: false, index: true
	},
}, {
	timestamps: true
});

POSInvoicesetupSchema.index({
    "name": "text",
});

POSInvoicesetupSchema.index({ owner:1, shop:1}, { unique: true });
module.exports = mongoose.model("POSInvoicesetup", POSInvoicesetupSchema);