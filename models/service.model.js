"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let ServiceSchema = new Schema({
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
}, {
	timestamps: true
});

// Add full-text search index
ServiceSchema.index({
	"name": "text",
});

module.exports = mongoose.model("Service", ServiceSchema);