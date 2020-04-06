"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let ScheduleLogSchema = new Schema({
    task: {
		type: Schema.Types.ObjectId, 
		ref: "scheduletask",
		index: true,
		required: "Task ID is required",
    },
	name: {
		type: String,
		index: true
    },
    errorMsg: {
        type: String, 
        index: true
	},
    done: {
		type: Boolean, default: false, index: true
	},
    date: {
		type: Date, default: new Date(), index: true
	},
}, {
	timestamps: true
});



module.exports = mongoose.model("ScheduleLog", ScheduleLogSchema);