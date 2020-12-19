"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let AppDataSchema = new Schema({
	name: {
		type: String,
		unique : true,
		index: true,
		required: "Name is required",
	},
	value: {
		type: String,
		required: "Value is required",
	},
}, {
	timestamps: true
});


module.exports = mongoose.model("AppData", AppDataSchema);