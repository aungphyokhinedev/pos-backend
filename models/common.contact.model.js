"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let CommonContactSchema = new Schema({
	uid: {
		type: Schema.Types.ObjectId, 
		ref: "ssouser",
		index: true,
		required: "User ID is required",
	},
	phone: {
		type: String,
		trim: true,
		index: true,
	},
	mobile: {
		type: String,
		trim: true,
		index: true,
	},
	hotline: {
		type: String,
		trim: true,
		index: true,
	},
	email: {
		type: String,
		trim: true,
		index: true,
	},
	fax: {
		type: String,
		trim: true,
		index: true,
	},
	name: {
		type: String,
		trim: true,
		index: true,
	},
	line1: {
		type: String,
		trim: true,
		index: true,
	},
	line2: {
		type: String,
		trim: true,
		index: true,
	},
	others: {
		type: String,
		trim: true,
	}
}, {
	timestamps: true
});


module.exports = mongoose.model("Contact", CommonContactSchema);