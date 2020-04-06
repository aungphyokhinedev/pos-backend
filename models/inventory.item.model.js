"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let InventoryItemSchema = new Schema({
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
	sku: {
		type: Schema.Types.ObjectId, 
		ref: "inventorysku",
		index: true,
		required: "SKU ID is required",
	},
	vendorProductCode: {
		type: String,
		trim: true,
		index: true,
	},
	color: {
		type: String,
		trim: true,
		index: true,
	},
	size: {
		type: String,
		default: 0
	},
	weight: {
		type: String,
		default: 0
	},
	unitInStock: {
		type: Number,
		default: 0,
		index: true,
	},
	unitInOrder: {
		type: Number,
		default: 0,
		index: true,
	},
	qtyPerUnit: {
		type: Number,
		default: 0
	},
	reorderLevel: {
		type: Number,
		default: 0
	},
	reorderQty: {
		type: Number,
		default: 0
	},
	category: {
		type: Schema.Types.ObjectId, 
		ref: "inventorycategory",
		index: true,
		required: "Category ID is required",
	},
	itemCode: {
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
		required: "Item Name is required"
	},
	description: {
		type: String,
		index: true
	},
}, {
	timestamps: true
});



module.exports = mongoose.model("InventoryItem", InventoryItemSchema);