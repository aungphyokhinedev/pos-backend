"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let POSCurrencySchema = new Schema({
	uid: {
		type: Schema.Types.ObjectId, 
		ref: "ssouser",
		index: true,
		required: "User ID is required",
	},
	name: {
		type: String,
        index: true
	},
	code: {
		type: String,
        index: true,
        unique : true
    },
    sign: {
		type: String,
        index: true,
	},
	deleteFlag: {
		type: Boolean, default: false, index: true
	},
}, {
	timestamps: true
});

POSCurrencySchema.index({
    "name": "text",
    "code": "text",
});



module.exports = mongoose.model("POSCurrency", POSCurrencySchema);