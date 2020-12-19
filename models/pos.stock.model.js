"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let POSStockSchema = new Schema({
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
    item: {
		type: Schema.Types.ObjectId, 
		ref: "POSitem",
		index: true,
		required: "Item ID is required",
	},
    shop: {
		type: Schema.Types.ObjectId, 
		ref: "posshop",
        index: true,
        required: "Shop ID is required",
    },
	name: {
		type: String,
		trim: true,
		index: true,
		required: "Name is required"
    },
    date: {
		type: Date, default: Date.now, index: true
	},
    qty: {
		type: Number,
		default: 0
	},
	deleteFlag: {
		type: Boolean, default: false, index: true
	},
}, {
	timestamps: true
});

POSStockSchema.index({
    "name": "text",
});



module.exports = mongoose.model("POSStock", POSStockSchema);