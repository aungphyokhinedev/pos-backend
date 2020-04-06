"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let RankingSchema = new Schema({
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
	user: {
		type: Schema.Types.ObjectId, 
		ref: "ssouser",
		index: true,
		required: "User ID is required",
	},
	rank: {
		type: Number,
		index: true
	},
}, {
	timestamps: true
});

RankingSchema.index({ name: 1, user: 1}, { unique: true });

module.exports = mongoose.model("Ranking", RankingSchema);