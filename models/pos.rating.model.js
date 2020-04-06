"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let RatingSchema = new Schema({
	uid: {
		type: Schema.Types.ObjectId, 
		ref: "ssouser",
		index: true,
		required: "User ID is required",
	},
	name: {
		type: String,
		index: true,
		required: "Name is required",
    },
    remark: {
		type: String,
		index: true,
		required: "Remark is required",
    },
    reply: {
		type: String,
	},
	user: {
		type: Schema.Types.ObjectId, 
		ref: "ssouser",
		index: true,
		required: "User ID is required",
	},
	rate: {
		type: Number,
        index: true,
        required: "Rate is required",
	},
}, {
	timestamps: true
});

RatingSchema.index({ name: 1, user: 1}, { unique: true });

module.exports = mongoose.model("Rating", RatingSchema);