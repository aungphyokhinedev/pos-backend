"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let POSBlackListSchema = new Schema({
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
		required: "Customer ID is required",
    },
    description: {
        type: String,
    },
    deleteFlag: {
		type: Boolean, default: false, index: true
	},
}, {
	timestamps: true
});
POSBlackListSchema.index({
    "description": "text",
});


module.exports = mongoose.model("POSBlacklist", POSBlackListSchema);