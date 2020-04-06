"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let AccountTypeSchema = new Schema({
	uid: {
		type: Schema.Types.ObjectId, 
		ref: "ssouser",
		required: "User ID is required",
		index: true
	},
	typeCode: {
		type: String,
		unique : true,
		index: true,
		required: "Type Code is required"
	},
	name: {
		type: String,
	},
	deleteFlag: {
		type: Boolean, default: false, index: true
	},
}, {
	timestamps: true
});

// Add full-text search index
AccountTypeSchema.index({
	"name": "text",
});

module.exports = mongoose.model("AccountType", AccountTypeSchema);