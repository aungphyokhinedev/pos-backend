"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let SSOUserSchema = new Schema({
	email: {
		type: String,
		trim: true,
		unique : true,
		index: true,
		required: "Email is required"
	},
	userName: {
		type: String,
		index: true,
		trim: true,
	},
	photoUrl: {
		type: String
	},
	password: String,
	resetPassword: String,
	token: {
		type: String,
		//required: true
	},
	provider: {
		type: String,
		index: true,
		required: "Provider is required"
	},
	providerId: {
		type: String,
		index: true
	},
	blocked: {
		type: Boolean, default: false, index: true
	},
	locked: {
		type: Boolean, default: false, index: true
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
	}
}, {
	timestamps: true
});

// Add full-text search index
SSOUserSchema.index({
	"email": "text",
	"provider": "text"
});

module.exports = mongoose.model("SSOUser", SSOUserSchema);