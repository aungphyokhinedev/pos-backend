"use strict";

let mongoose = require("mongoose");
let pointSchema = mongoose.Schema;
pointSchema = new mongoose.Schema({
	type: {
		type: String,
		enum: ["Point"],
		required: true
	},
	coordinates: {
		type: [Number],
		required: true
	}
});
  
module.exports = pointSchema;