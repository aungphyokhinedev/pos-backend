"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let POSFavouriteSchema = new Schema({
	uid: {
		type: Schema.Types.ObjectId, 
		ref: "ssouser",
		index: true,
		required: "User ID is required",
	},
	user: {
        type: Schema.Types.ObjectId, 
        required: "User ID is required",
		index: true,
    },
	transactionID: {
		type: Schema.Types.ObjectId, 
		index: true,
		required: "Transaction ID is required",
	}, 
    type: {
		type: String,
		index: true,
		required: "Type is required",
	},
}, {
	timestamps: true
});

POSFavouriteSchema.index({ user:1,  transactionID: 1}, { unique: true });
module.exports = mongoose.model("POSFavourite", POSFavouriteSchema);