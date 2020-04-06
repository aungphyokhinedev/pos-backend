"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let ScheduleRuleSchema = new Schema({
	uid: {
		type: Schema.Types.ObjectId, 
		ref: "ssouser",
		index: true,
		required: "User ID is required",
	},
	name: {
		type: String,
		trim: true,
		index: true,
		required: "Schedule Name is required"
	},
	remark: {
		type: String,
		index: true
	},
	day: {
		type: Number, default: null, index: true
	},
	month: {
		type: Number, default: null, index: true
	},
	year: {
		type: Number, default: null, index: true
	},
	weekDay: {
		type: Number, default: null, index: true
	},
	hour: {
		type: Number, default: null, index: true
	},
	minute: {
		type: Number, default: null, index: true
	},

}, {
	timestamps: true
});



module.exports = mongoose.model("ScheduleRule", ScheduleRuleSchema);