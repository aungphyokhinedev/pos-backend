"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let POSExtrainfoSchema = new Schema({
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
    shopItem: {
		type: Schema.Types.ObjectId, 
		ref: "posshopitem",
		index: true,
		required: "Shop Item ID is required",
    },
    name: {
        type: String,
        index: true,
    },
    value: {
        type: String,
        required: "Value is required",
        index: true,
    },
    unitPrice: {
		type: Number,
	},
    photo: {
        type: String,
    },
	deleteFlag: {
		type: Boolean, default: false, index: true
	},
}, {
	timestamps: true
});

POSExtrainfoSchema.index({
    "value": "text",
    "name":"text"
});

module.exports = mongoose.model("POSExtrainfo", POSExtrainfoSchema);