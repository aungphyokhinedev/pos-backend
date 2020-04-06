"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let POSBillSchema = new Schema({
	uid: {
		type: Schema.Types.ObjectId, 
		ref: "ssouser",
		index: true,
		required: "User ID is required",
	},
	owner: {
		type: Schema.Types.ObjectId, 
		ref: "posowner",
		index: true,
		required: "Owner ID is required",
    },
	billNumber: {
		type: String,
		trim: true,
		index: true,
	},
	billDate: {
		type: Date, default: new Date(), index: true
	},
	paymentDate: {
		type: Date, default: new Date(), index: true
	},
    amount: {
		type: Number,
		default: 0
    },
    discount: {
		type: Number,
		default: 0
    },
    paymentMethod: {
		type: String,
		trim: true,
		index: true,
    },
    effectiveMonths: {
		type: Number,
		index: true,
	},
	name: {
		type: String,
		trim: true,
		index: true,
		required: "Bill Name is required"
	},
	remark: {
		type: String,
		index: true
	},
	deleteFlag: {
		type: Boolean, default: false, index: true
	},
}, {
	timestamps: true
});


module.exports = mongoose.model("POSBill", POSBillSchema);