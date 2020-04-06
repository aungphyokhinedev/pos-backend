"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let pointSchema = require("./point.scheme.model");

let GeolocationSchema = new Schema({
	uid: {
		type: Schema.Types.ObjectId, 
		ref: "ssouser",
		index: true,
		required: "User ID is required",
	},
	location: {
		type: pointSchema,
		required: true,
		index: true
	},
	name: {
		type: String,
		index: true
	},
}, {
	timestamps: true
});

GeolocationSchema.index({location: "2dsphere"});

module.exports = mongoose.model("Geolocation", GeolocationSchema);