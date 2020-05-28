"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let POSCriteriaSchema = new Schema({
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
        index: true,
        unique : true,
        required: "Name is required",
    },
    data: {
        type: String,
        required: "Data is required",
    },
	deleteFlag: {
		type: Boolean, default: false, index: true
	},
}, {
	timestamps: true
});

POSCriteriaSchema.index({
    "name": "text"
});

module.exports = mongoose.model("POSCriteria", POSCriteriaSchema);