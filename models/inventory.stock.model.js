"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let InventoryStockSchema = new Schema({
	uid: {
		type: Schema.Types.ObjectId, 
		ref: "ssouser",
		index: true,
		required: "User ID is required",
	},
	item: {
		type: Schema.Types.ObjectId, 
		ref: "inventoryitem",
		index: true,
		required: "Item ID is required",
	},
	qty: {
		type: Number,
		default: 0,
		index: true,
		required: "Qty is required",
	},
	date: {
		type: Date, default: new Date(), index: true
	},
	deleteFlag: {
		type: Boolean, default: false, index: true
	},
	name: {
		type: String,
		index: true
	},
}, {
	timestamps: true
});



module.exports = mongoose.model("InventoryStock", InventoryStockSchema);