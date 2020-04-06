"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let InventoryBrandSchema = new Schema({
	uid: {
		type: Schema.Types.ObjectId, 
		ref: "ssouser",
		index: true,
		required: "User ID is required",
	},
	shortName: {
		type: String,
		trim: true,
		unique : true,
		index: true,
		required: "Brand short name is required"
	},
	name: {
		type: String,
		trim: true,
		index: true,
		required: "Brand Name is required"
	},
}, {
	timestamps: true
});



module.exports = mongoose.model("InventoryBrand", InventoryBrandSchema);