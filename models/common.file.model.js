"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let FileSchema = new Schema({
	name: {
		type: String,
		index: true
	},
	uid: {
		type: Schema.Types.ObjectId, 
		ref: "ssouser",
		required: "User ID is required",
		index: true
	},
	fileName: {
		type: String,
		unique : true,
		index: true		
	},
	size: {
		type: Number,
		index: true		
	},
	folder: {
		type: String,
		index: true
	},
	type: {
		type: String,
		index: true
	},
	isCleaned: {
		type: Boolean, default: false, index: true
	},
	date: {
		type: Date, default: new Date(),
		index: true
	}
}, {
	timestamps: true
});


module.exports = mongoose.model("File", FileSchema);