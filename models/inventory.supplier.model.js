
"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let InventorySupplierSchema = new Schema({
	uid: {
		type: Schema.Types.ObjectId, 
		ref: "ssouser",
		index: true,
		required: "User ID is required",
	},
	name: {
		type: String,
		unique : true,
		index: true,
		required: "Supplier name is required",
	},
	companyName: {
		type: String,
		index: true,
	},
	contactFirstName: {
		type: String,
		index: true,
	},
	contactLastName: {
		type: String,
		index: true,
	},
	contactTitle: {
		type: String,
		index: true,
	},
	description: {
		type: String,
		index: true
	},
	url: {
		type: String,
		index: true
	},
	logo: {
		type: String,
		index: true
	},
	typeGoods: {
		type: String,
		index: true
	},
	paymentMethod: {
		type: String,
		index: true
	},
}, {
	timestamps: true
});



module.exports = mongoose.model("InventorySupplier", InventorySupplierSchema);