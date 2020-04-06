"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let POSSaleSchema = new Schema({
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
	user: {
		type: Schema.Types.ObjectId, 
		ref: "posuser",
		index: true,
		required: "Sale User ID is required",
    },
	customer: {
		type: Schema.Types.ObjectId, 
		ref: "poscustomer",
		index: true,
    },
    shop: {
		type: Schema.Types.ObjectId, 
		ref: "posshop",
		index: true,
		required: "Shop ID is required",
	},
	invoiceNumber: {
		type: String,
		trim: true,
		index: true,
	},
	date: {
		type: Date, default: new Date(), index: true
	},
	status: {
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
		required: "Sale Name is required"
	},
	remark: {
		type: String,
		index: true
	},
    tax: {
		type: Number,
		default: 0
	},
    adjustment: {
		type: Number,
		default: 0
    },
    adjustmentRemark: {
		type: String,
		index: true
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
POSSaleSchema.index({
    "name": "text",
    "remark": "text",
});

module.exports = mongoose.model("POSSale", POSSaleSchema);