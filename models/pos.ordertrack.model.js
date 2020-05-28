"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let POSOrderTrackSchema = new Schema({
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
		required: "Customer ID is required",
    },
    shop: {
		type: Schema.Types.ObjectId, 
		ref: "posshop",
		index: true,
		required: "Shop ID is required",
	},
	order: {
		type: Schema.Types.ObjectId, 
		ref: "POSorder",
		index: true,
		required: "Order ID is required",
    },	
    orderNumber: {
		type: String, 
		trim: true,
		index: true,
	},
	name: {
		type: String,
		trim: true,
		index: true,
	},
	date: {
		type: Date, default: new Date(), index: true
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
POSOrderTrackSchema.index({
    "name": "text",
    "orderNumber": "text",
});



module.exports = mongoose.model("POSOrderTrack", POSOrderTrackSchema);