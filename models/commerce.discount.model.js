"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let CommerceDiscountSchema = new Schema({
	uid: {
		type: Schema.Types.ObjectId, 
		ref: "ssouser",
		index: true,
		required: "User ID is required",
	},
	percentage: {
		type: Number,
		default: 0
	},
	flatRate: {
		type: Number,
		default: 0
	},
	name: {
		type: String,
		index: true
	},
}, {
	timestamps: true
});



module.exports = mongoose.model("CommerceDiscount", CommerceDiscountSchema);