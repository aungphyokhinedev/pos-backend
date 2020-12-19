"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let POSRankingSchema = new Schema({
	uid: {
		type: Schema.Types.ObjectId, 
		ref: "ssouser",
		index: true,
		required: "User ID is required",
	},
	customer: {
		type: Schema.Types.ObjectId, 
		ref: "poscustomer",
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
	rank: {
		type: Number,
		index: true
	},
	review: {
		type: String,
		index: true,
		required: "Review is required",
	},
}, {
	timestamps: true
});

POSRankingSchema.index({ transactionID: 1, customer: 1, type:1}, { unique: true });

module.exports = mongoose.model("POSRanking", POSRankingSchema);