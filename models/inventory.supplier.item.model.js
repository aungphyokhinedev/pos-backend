
"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let InventorySupplierItemSchema = new Schema({
	uid: {
		type: Schema.Types.ObjectId, 
		ref: "ssouser",
		index: true,
		required: "User ID is required",
	},
	supplier: {
		type: Schema.Types.ObjectId, 
		ref: "inventorysupplier",
		index: true,
		required: "Supplier ID is required",
	},
	item: {
		type: Schema.Types.ObjectId, 
		ref: "inventoryitem",
		index: true,
		required: "Item ID is required",
	},
	totalValue: {
		type: Number,
		default: 0,
		index: true,
	},
	totalQty:{
		type: Number,
		default: 0,
		index: true,
	},
	maxQty:{
		type: Number,
		default: 0,
		index: true,
	},
	minQty:{
		type: Number,
		default: 0,
		index: true,
	},
	deliveryLeadDays:{
		type: Number,
		default: 0,
		index: true,
	},
	standardPrice:{
		type: Number,
		default: 0,
		index: true,
	},
	discountedPrice:{
		type: Number,
		default: 0,
		index: true,
	},

	name: {
		type: String,
		index: true
	},
}, {
	timestamps: true
});



module.exports = mongoose.model("InventorySupplierItem", InventorySupplierItemSchema);