"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let AccountAccessRuleSchema = new Schema({
	uid: {
		type: Schema.Types.ObjectId, 
		ref: "ssouser",
		index: true,
		required: "User ID is required",
	},
	lowerLimit: {
		type: Number,
	},
	upperLimit: {
		type: Number,
	},
	canDebit: {
		type: Boolean, default: false, index: true
	},
	canCredit: {
		type: Boolean, default: false, index: true
	},
	isPrivate: {
		type: Boolean, default: false, index: true
	},
	name: {
		type: String,
		trim: true,
		unique : true,
		index: true,
		required: "Name is required"
	}
}, {
	timestamps: true
});

// Add full-text search index
AccountAccessRuleSchema.index({
	"name": "text",
});

module.exports = mongoose.model("AccountAccessRule", AccountAccessRuleSchema);