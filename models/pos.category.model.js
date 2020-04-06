"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let POSCategorySchema = new Schema({
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
	categoryCode: {
		type: String,
		trim: true,
		unique : true,
		index: true,
		required: "Category Code is required"
	},
	name: {
		type: String,
		index: true
    },
    photo: {
		type: String,
		trim: true,
		index: true,
    },
    color: {
		type: String,
		trim: true,
		index: true,
    },
}, {
	timestamps: true
});

POSCategorySchema.index({
    "name": "text",
    "categoryCode": "text",
});


POSCategorySchema.index({ owner:1,  categoryCode: 1}, { unique: true });
module.exports = mongoose.model("POSCategory", POSCategorySchema);