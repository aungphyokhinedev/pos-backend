"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let SocketRoomUserSchema = new Schema({
	uid: {
		type: Schema.Types.ObjectId, 
		ref: "ssouser",
		index: true,
		required: "User ID is required",
	},
	user: {
		type: Schema.Types.ObjectId, 
		ref: "ssouser",
		index: true,
		required: "User ID is required",
	},
	room: {
		type: Schema.Types.ObjectId, 
		ref: "socketroom",
		index: true,
		required: "Room ID is required",
	},
	name: {
		type: String,
		index: true,
		unique : true,
	},
	requestFlag: {
		type: Boolean, default: false, index: true
	},
	inviteFlag: {
		type: Boolean, default: false, index: true
	},
	acceptFlag: {
		type: Boolean, default: false, index: true
	},
}, {
	timestamps: true
});
// Add full-text search index
SocketRoomUserSchema.index({
	"name": "text",
});


module.exports = mongoose.model("SocketRoomUser", SocketRoomUserSchema);