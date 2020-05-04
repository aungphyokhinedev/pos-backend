"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let POSReviewSchema = new Schema({
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
	review: {
		type: String,
		index: true,
		required: "Review is required",
	},
}, {
	timestamps: true
});


module.exports = mongoose.model("POSReview", POSReviewSchema);