"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let CommonCodeSchema = new Schema({
	uid: {
		type: Schema.Types.ObjectId, 
		ref: "ssouser",
		index: true,
		required: "User ID is required",
	},
	commonCode: {
		type: String,
		trim: true,
		index: true,
		required: "Common Code is required"
	},
	type: {
		type: String,
		trim: true,
		index: true,
		required: "Type is required"
	},
	name: {
		type: String,
		index: true
	},
}, {
	timestamps: true
});

CommonCodeSchema.index({commonCode:1, type:1}, { unique: true });

module.exports = mongoose.model("Code", CommonCodeSchema);