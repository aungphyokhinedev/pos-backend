"use strict"; 

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let POSTaxSchema = new Schema({
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
	percentage: {
		type: Number,
		default: 0
	},
	flatRate: {
		type: Number,
		default: 0
    },
    logo: {
		type: String,
		trim: true,
		index: true,
	},
	name: {
		type: String,
		index: true
	},
	description: {
		type: String,
		index: true
	},
	deleteFlag: {
		type: Boolean, default: false, index: true
	},
}, {
	timestamps: true
});

POSTaxSchema.index({
    "name": "text",
    "description": "text",
});



module.exports = mongoose.model("POSTax", POSTaxSchema);