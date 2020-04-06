"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let AccessRuleSchema = new Schema({
    name: {
		type: String,
		unique : true,
		index: true
	},
	uid: {
		type: Schema.Types.ObjectId, 
		ref: "ssouser",
		required: "User ID is required",
		index: true
	},
	userGroup: {
		type: Schema.Types.ObjectId, 
		ref: "usergroup",
		index: true,
		required: "User group is required",
		
	},
	application: {
		type: Schema.Types.ObjectId, 
		ref: "application",
		index: true,
		required: "Application is required",
	},
	service: {
		type: Schema.Types.ObjectId, 
		ref: "service",
		index: true,
		required: "Service is required",
	},
	rule: {
		type: Schema.Types.ObjectId, 
		ref: "rule",
		index: true,
		required: "Rule is required",
	},
}, {
	timestamps: true
});
AccessRuleSchema.index({
	"name": "text",
});

module.exports = mongoose.model("AccessRule", AccessRuleSchema);