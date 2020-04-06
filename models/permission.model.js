"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let PermissionSchema = new Schema({
	name: {
		type: String,
		unique : true,
		index: true
	},
	user: {
		type: Schema.Types.ObjectId, 
		ref: "ssouser",
		index: true,
		required: "User is required",
	},
	userGroup: {
		type: Schema.Types.ObjectId, 
		ref: "usergroup",
		index: true,
		required: "User group is required",
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

PermissionSchema.index({
	"name": "text",
});
module.exports = mongoose.model("Permission", PermissionSchema);