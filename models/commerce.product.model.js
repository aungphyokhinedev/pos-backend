"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let CommerceProductSchema = new Schema({
	uid: {
		type: Schema.Types.ObjectId, 
		ref: "ssouser",
		index: true,
		required: "User ID is required",
	},
	brand: {
		type: Schema.Types.ObjectId, 
		ref: "inventorybrand",
		index: true,
		required: "Brand ID is required",
	},
	discount: {
		type: Schema.Types.ObjectId, 
        ref: "commercediscount",
        index: true,
    },
    category: {
		type: Schema.Types.ObjectId, 
		ref: "commercecategory",
		index: true,
		required: "Category ID is required",
	},
	color: {
		type: String,
		trim: true,
		index: true,
	},
	unit: {
		type: String,
		trim: true,
		index: true,
	},
	size: {
		type: String,
		default: 0
	},
	ranking: {
		type: Number,
		default: 0
	},
	weight: {
		type: Number,
		default: 0
	},
	qtyPerUnit: {
		type: Number,
		default: 0
	},
	qty: {
		type: Number,
		default: 0
	},
	unitPrice: {
		type: Number,
		default: 0
	},
	
	productCode: {
		type: String,
		trim: true,
		unique : true,
		index: true,
		required: "Item code is required"
	},
	name: {
		type: String,
		trim: true,
		index: true,
		required: "Product Name is required"
	},
	description: {
		type: String,
		index: true
	},
	note: {
		type: String,
		index: true
	},
}, {
	timestamps: true
});



module.exports = mongoose.model("CommerceProduct", CommerceProductSchema);