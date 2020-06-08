"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let POSOfferSchema = new Schema({
	uid: {
		type: Schema.Types.ObjectId, 
		ref: "ssouser",
		index: true,
		required: "User ID is required",
	},
	id: {
		type: Schema.Types.ObjectId, 
		index: true,
    },
	date: {
		type: Date, default: Date.now, index: true
	},
	serial: {
		type: Number,
		default: 0
	},
    type: {
		type: String,
        index: true,
        required: "Type is required",
	}
}, {
	timestamps: true
});
POSOfferSchema.index({
    "type": "text",
});

module.exports = mongoose.model("POSOffer", POSOfferSchema);