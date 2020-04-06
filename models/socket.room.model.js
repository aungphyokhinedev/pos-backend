"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let SocketRoomSchema = new Schema({
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
SocketRoomSchema.index({
	"name": "text",
});

module.exports = mongoose.model("SocketRoom", SocketRoomSchema);