"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let AccountUnitSchema = new Schema({
	uid: {
		type: Schema.Types.ObjectId, 
		ref: "ssouser",
		index: true,
		required: "User ID is required",
	},
	unitCode: {
		type: String,
		trim: true,
		unique : true,
		required: "Unit Code is required"
	},
	unit: {
		type: String,
		index: true,
		required: "Unit is required"
	},
	name: {
		type: String,
        index: true
	},
}, {
	timestamps: true
});

// Add full-text search index
AccountUnitSchema.index({
	"name": "text",
});

module.exports = mongoose.model("AccountUnit", AccountUnitSchema);