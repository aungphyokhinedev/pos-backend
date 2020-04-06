"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let AccountJournalSchema = new Schema({
	uid: {
		type: Schema.Types.ObjectId, 
		ref: "ssouser",
		index: true,
		required: "User ID is required",
	},
	correlationID: {
		type: String,
		index: true,
		unique : true
	},
	unit: {
		type: Schema.Types.ObjectId, 
		ref: "AccountUnit",
		required: "Unit is required",
		index: true 
        
	},
	transactionCode: {
		type: String,
		index: true,
		required: "Transaction Code is required"
	},
	transactionDate: {
		type: Date, default: Date.now,
		index: true
	},
	narration: {
		type: String,
		index: true
	},
	date: {
		type: Date, default: new Date(),
		index: true
	},
	deleteFlag: {
		type: Boolean, default: false, index: true
	},
}, {
	timestamps: true
});

// Add full-text search index
AccountJournalSchema.index({
	"narration": "text",
	"correlationID": "text",
});

module.exports = mongoose.model("AccountJournal", AccountJournalSchema);