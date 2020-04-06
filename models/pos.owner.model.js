"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let POSOwnerSchema = new Schema({
	uid: {
		type: Schema.Types.ObjectId, 
        ref: "ssouser",
		index: true,
		required: "User ID is required",
	},
	owner: {
		type: Schema.Types.ObjectId, 
        ref: "ssouser",
        unique : true,
		index: true,
		required: "Owner is required",
    },
	companyName: {
		type: String,
		trim: true,
		index: true,
		required: "Company Name is required"
    },
    codeName: {
		type: String,
		trim: true,
		unique : true,
		index: true,
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
	},
	logo: {
		type: String,
		trim: true,
	},
    mobile: {
		type: String,
		trim: true,
		index: true,
	},
	email: {
		type: String,
		trim: true,
		index: true,
    },
    expiredDate: {
		type: Date, default: new Date(), index: true
    },
    needNotify: {
		type: Boolean, default: false, index: true
    },
    notification: {
		type: String,
		trim: true,
    },
	blocked: {
		type: Boolean, default: false, index: true
	},
	locked: {
		type: Boolean, default: false, index: true
	},
	deleteFlag: {
		type: Boolean, default: false, index: true
	},
}, {
	timestamps: true
});

// Add full-text search index
POSOwnerSchema.index({
    "name": "text",
    "companyName": "text",
    "codeName": "text",
	"description": "text"
});

module.exports = mongoose.model("POSOwner", POSOwnerSchema);