"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let ScheduleTaskRuleSchema = new Schema({
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
    rule: {
		type: Schema.Types.ObjectId, 
		ref: "schedulerule",
		index: true,
		required: "Rule ID is required",
	},
	name: {
		type: String,
		trim: true,
		index: true,
		required: "Task Rule Name is required"
	},
	recurring: {
		type: Boolean, default: false, index: true
	},
	active: {
		type: Boolean, default: false, index: true
	}
}, {
	timestamps: true
});



module.exports = mongoose.model("ScheduleTaskRule", ScheduleTaskRuleSchema);