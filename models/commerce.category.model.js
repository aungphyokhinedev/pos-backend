"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let CommerceCategorySchema = new Schema({
	uid: {
		type: Schema.Types.ObjectId, 
		ref: "ssouser",
		index: true,
		required: "User ID is required",
	},
	categoryCode: {
		type: String,
		trim: true,
		unique : true,
		index: true,
		required: "Category Code is required"
	},
	name: {
		type: String,
		index: true
	},
}, {
	timestamps: true
});



module.exports = mongoose.model("CommerceCategory", CommerceCategorySchema);