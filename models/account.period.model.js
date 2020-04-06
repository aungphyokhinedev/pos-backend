"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let AccountPeriodSchema = new Schema({
	serial: {
		type: Number,
		unique : true,
		required: "Serial is required",
		index: true
	},
	name: {
		type: String,
		index: true
	},
	done: {
		type: Boolean, default: false, index: true
	},
	date: {
		type: Date, default: new Date(),
		index: true
	},
}, {
	timestamps: true
});

// Add full-text search index
AccountPeriodSchema.index({
	"name": "text",
});

module.exports = mongoose.model("AccountPeriod", AccountPeriodSchema);