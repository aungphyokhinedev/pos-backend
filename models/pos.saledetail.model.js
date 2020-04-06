"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let POSSaleDetailSchema = new Schema({
	uid: {
		type: Schema.Types.ObjectId, 
		ref: "ssouser",
		index: true,
		required: "User ID is required",
	},
	user: {
		type: Schema.Types.ObjectId, 
		ref: "posuser",
		index: true,
		required: "Sale User ID is required",
    },
	owner: {
		type: Schema.Types.ObjectId, 
		ref: "posowner",
		index: true,
		required: "Owner ID is required",
    },
	sale: {
		type: Schema.Types.ObjectId, 
		ref: "POSSale",
		index: true,
		required: "Sale ID is required",
	},
	item: {
		type: Schema.Types.ObjectId, 
		ref: "POSitem",
		index: true,
		required: "Item ID is required",
	},
	invoiceNumber: {
		type: String,
		trim: true,
		index: true,
	},
	unitPrice: {
		type: Number,
		default: 0
	},
	discountedPrice: {
		type: Number,
		default: 0
	},
	qty: {
		type: Number,
		default: 0
	},
	amount: {
		type: Number,
		default: 0
	},
	unit: {
		type: String,
		trim: true,
		index: true,
	},
	status: {
		type: String,
		trim: true,
		index: true,
	},
	date: {
		type: Date, default: new Date(), index: true
	},
	name: {
		type: String,
		trim: true,
		index: true,
		required: "Sale Detail Name is required"
	},
	remark: {
		type: String,
		index: true
	},
	deleteFlag: {
		type: Boolean, default: false, index: true
	},
}, {
	timestamps: true
});

POSSaleDetailSchema.index({
    "name": "text",
});

module.exports = mongoose.model("POSSaleDetail", POSSaleDetailSchema);