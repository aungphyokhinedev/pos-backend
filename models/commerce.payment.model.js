"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let CommercePaymentSchema = new Schema({
	uid: {
		type: Schema.Types.ObjectId, 
		ref: "ssouser",
		index: true,
		required: "User ID is required",
    },
    type: {
		type: Schema.Types.ObjectId, 
		ref: "code",
		index: true,
		required: "Payment Type is required",
	},
	amount: {
		type: Number,
		default: 0
	},
	done: {
		type: Boolean, default: false, index: true
	},
	name: {
		type: String,
		trim: true,
		index: true,
		required: "Payment Name is required"
	},
	
	status: {
		type: String,
		index: true
	},
	narration: {
		type: String,
		index: true
	},
	date: {
		type: Date, default: new Date(),
		index: true
	},
	deleteFlag: {
		type: Boolean, default: false, index: true
	},
}, {
	timestamps: true
});



module.exports = mongoose.model("CommercePayment", CommercePaymentSchema);