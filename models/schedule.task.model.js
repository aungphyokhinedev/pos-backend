"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let ScheduleTaskSchema = new Schema({
	uid: {
		type: Schema.Types.ObjectId, 
		ref: "ssouser",
		index: true,
		required: "User ID is required",
    },
    service: {
		type: String,
		trim: true,
		index: true,
		required: "Service Name is required"
	},
	name: {
		type: String,
		trim: true,
		index: true,
		required: "Task Name is required"
	},
	remark: {
		type: String,
		index: true
	},
	method: {
		type: String,
		index: true
	},
    active: {
		type: Boolean, default: false, index: true
	},
}, {
	timestamps: true
});



module.exports = mongoose.model("ScheduleTask", ScheduleTaskSchema);