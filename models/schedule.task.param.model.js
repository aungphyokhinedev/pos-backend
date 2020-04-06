"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let ScheduleTaskParamSchema = new Schema({
	uid: {
		type: Schema.Types.ObjectId, 
		ref: "ssouser",
		index: true,
		required: "User ID is required",
	},
	task: {
		type: Schema.Types.ObjectId, 
		ref: "scheduletask",
		index: true,
		required: "Task ID is required",
	},
	name: {
		type: String,
		trim: true,
		index: true,
		required: "Param Name is required"
	},
	value: {
		type: String,
		trim: true,
		index: true,
		required: "Param Value is required"
	}
}, {
	timestamps: true
});



module.exports = mongoose.model("ScheduleTaskParam", ScheduleTaskParamSchema);