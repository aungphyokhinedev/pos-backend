"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let POSItemSchema = new Schema({
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
    category: {
		type: Schema.Types.ObjectId, 
		ref: "poscategory",
		index: true,
		required: "Category ID is required",
    },
    itemCode: {
		type: String,
		trim: true,
        index: true,
        required: "Code is required"
	},
	name: {
		type: String,
		trim: true,
		index: true,
		required: "Name is required"
	},
    description: {
		type: String,
		trim: true,
		index: true,
		required: "Description is required"
    },
    unitPrice: {
		type: Number,
		default: 0
	},
    unit: {
		type: String,
		trim: true,
		index: true,
    },
    discount: {
		type: Schema.Types.ObjectId, 
        ref: "POSDiscount",
        index: true,
    },
	photo: {
		type: String,
		trim: true,
		index: true,
	},
    deliverable: {
		type: Boolean, default: false, index: true
	},
	deleteFlag: {
		type: Boolean, default: false, index: true
	},
}, {
	timestamps: true
});

POSItemSchema.index({
    "name": "text",
    "itemCode": "text",
});


POSItemSchema.index({ owner:1,  itemCode: 1}, { unique: true });
module.exports = mongoose.model("POSItem", POSItemSchema);