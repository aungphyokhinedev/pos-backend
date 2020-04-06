"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let SocketEventSchema = new Schema({
	uid: {
		type: Schema.Types.ObjectId, 
		ref: "ssouser",
		index: true,
		required: "User ID is required",
	},
	name: {
		type: String,
		index: true,
		unique : true,
	},
	deleteFlag: {
		type: Boolean, default: false, index: true
	},
}, {
	timestamps: true
});

// Add full-text search index
SocketEventSchema.index({
	"name": "text",
});

module.exports = mongoose.model("SocketEvent", SocketEventSchema);