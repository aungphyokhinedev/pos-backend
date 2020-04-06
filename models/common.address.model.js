"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let CommonAddressSchema = new Schema({
	uid: {
		type: Schema.Types.ObjectId, 
		ref: "ssouser",
		index: true,
		required: "User ID is required",
	},
	geolocation: {
		type: Schema.Types.ObjectId, 
		ref: "geolocation",
	},
	name: {
		type: String,
		trim: true,
		index: true,
		unique: true,
		required: "Name is required",
	},
	line1: {
		type: String,
		trim: true,
	},
	line2: {
		type: String,
		trim: true,
	},
	line3: {
		type: String,
		trim: true,
	},
	city: {
		type: Schema.Types.ObjectId, 
		ref: "code",
		index: true,
		required: "City is required",
	},
	state: {
		type: Schema.Types.ObjectId, 
		ref: "code",
		index: true,
		required: "State is required",
	},
	zip: {
		type: String,
		index: true,
		trim: true,
	},
	country: {
		type: Schema.Types.ObjectId, 
		ref: "code",
		index: true,
		required: "Country is required",
	},
	others: {
		type: String,
		trim: true,
	}
}, {
	timestamps: true
});


module.exports = mongoose.model("Address", CommonAddressSchema);