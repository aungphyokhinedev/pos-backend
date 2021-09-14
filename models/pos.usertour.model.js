"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let POSUserTourSchema = new Schema({
	uid: {
		type: Schema.Types.ObjectId, 
		ref: "ssouser",
		index: true,
		required: "User ID is required",
	},
	user: {
		type: Schema.Types.ObjectId, 
		ref: "ssouser",
        index: true,
        required: "User ID is required",
    },
    type: {
		type: String,
		index: true,
		required: "Type is required",
	},
	progress: {
        type: Number,
        default: 0,
		index: true
    },
    remark: {
		type: String,
		trim: true,
		index: true,
	},
	finish: {
		type: Boolean, default: false, index: true
	},
}, {
	timestamps: true
});

POSUserTourSchema.index({  user: 1, type:1}, { unique: true });

module.exports = mongoose.model("POSUserTour", POSUserTourSchema);