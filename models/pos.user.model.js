"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let POSUserSchema = new Schema({
	uid: {
		type: Schema.Types.ObjectId, 
		ref: "ssouser",
		index: true,
		required: "User ID is required",
    },
    owner: {
		type: Schema.Types.ObjectId, 
		ref: "posowner",
		index: true,
		required: "Owner ID is required",
	},
	shop: {
		type: Schema.Types.ObjectId, 
		ref: "posshop",
		index: true,
    },
	name: {
		type: String,
		trim: true,
		index: true,
		required: "Name is required"
	},
	password: {
		type: String,
	},
	
    fullName: {
		type: String,
		trim: true,
		index: true,
		required: "Full Name is required"
	},
    description: {
		type: String,
		trim: true,
		index: true,
		required: "Description is required"
    },
    mobile: {
		type: String,
		trim: true,
		index: true,
	},
	email: {
		type: String,
		trim: true,
		index: true,
    },
    photo: {
		type: String,
		trim: true,
		index: true,
	},
	blocked: {
		type: Boolean, default: false, index: true
	},
	locked: {
		type: Boolean, default: false, index: true
	},
	deleteFlag: {
		type: Boolean, default: false, index: true
	},
	loginFail: {
		type: Number,
		default: 0
	},
	lastPasswordChange: {
		type: Date,
		index: true
	},
	lastLoggedInDate: {
		type: Date, default: new Date(),
		index: true
	},
	lastSucessfullLoggedInDate: {
		type: Date, default: new Date(),	index: true
	},
}, {
	timestamps: true
});

POSUserSchema.index({
    "name": "text",
    "fullName": "text",
});
POSUserSchema.index({ owner:1, name:1}, { unique: true });
module.exports = mongoose.model("POSUser", POSUserSchema);