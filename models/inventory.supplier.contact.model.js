
"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let InventorySupplierContactSchema = new Schema({
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
	address: {
		type: Schema.Types.ObjectId, 
		ref: "address",
		index: true,
		required: "Address ID is required",
	},
	contact: {
		type: Schema.Types.ObjectId, 
		ref: "contact",
		index: true,
		required: "Contact ID is required",
	},
	name: {
		type: String,
		index: true
	},
}, {
	timestamps: true
});



module.exports = mongoose.model("InventorySupplierContact", InventorySupplierContactSchema);