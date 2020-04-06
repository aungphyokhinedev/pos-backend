"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let RuleSchema = new Schema({
	name: {
		type: String,
		unique : true,
		index: true,
		required: "Name is required",
	},
	uid: {
		type: Schema.Types.ObjectId, 
		ref: "ssouser",
		index: true,
		required: "User ID is required",
	},
	
	create: {
		type: Boolean, default: false, index: true
	},
	read: {
		type: Boolean, default: false, index: true
	},
	update: {
		type: Boolean, default: false, index: true
	},
	delete: {
		type: Boolean, default: false, index: true
	},
}, {
	timestamps: true
});

// Add full-text search index
RuleSchema.index({
	"name": "text",
});

module.exports = mongoose.model("Rule", RuleSchema);