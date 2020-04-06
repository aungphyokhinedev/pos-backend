"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let POSNotiSchema = new Schema({
	owner: {
		type: Schema.Types.ObjectId, 
		ref: "posowner",
		index: true,
    },
	customer: {
		type: Schema.Types.ObjectId, 
		ref: "poscustomer",
		index: true,
    },
    shop: {
		type: Schema.Types.ObjectId, 
		ref: "posshop",
		index: true,
	},
	action: {
		type: String,
		index: true
    },
    type: {
		type: String,
		index: true
    },
    message: {
		type: String,
		index: true
    },
    title: {
		type: String,
		index: true
    },
    id: {
		type: String,
		index: true
	},
	checked: {
		type: Boolean, default: false, index: true
	},
}, {
	timestamps: true
});

POSNotiSchema.index({
    "title": "text",
});


module.exports = mongoose.model("POSNoti", POSNotiSchema);