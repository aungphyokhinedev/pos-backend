"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let CommerceInfoSchema = new Schema({
	uid: {
		type: Schema.Types.ObjectId, 
		ref: "ssouser",
		index: true,
		required: "User ID is required",
	},
	type: {
		type: Schema.Types.ObjectId, 
		ref: "code",
		index: true,
		required: "Type is required",
	},
	value: {
		type: String,
		index: true
	},
	name: {
		type: String,
		index: true
	},
}, {
	timestamps: true
});



module.exports = mongoose.model("CommerceInfo", CommerceInfoSchema);