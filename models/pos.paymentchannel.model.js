"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let POSPaymentChannelSchema = new Schema({
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
	name: {
		type: String,
		trim: true,
		index: true,
		required: "Channel Name is required"
	},
	remark: {
		type: String,
		index: true
	},
	deleteFlag: {
		type: Boolean, default: false, index: true
	},
}, {
	timestamps: true
});
POSPaymentChannelSchema.index({
    "name": "text",
});

module.exports = mongoose.model("POSPaymentChannel", POSPaymentChannelSchema);