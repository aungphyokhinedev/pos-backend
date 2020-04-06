"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let AccountPostingSchema = new Schema({
	uid: {
		type: Schema.Types.ObjectId, 
		ref: "ssouser",
		required: "User ID is required",
	},
	amount: {
		type: Number,
		required: "Amount is required",
	},
	account: {
		type: Schema.Types.ObjectId, 
		ref: "account",
		required: "Account is required",
		index: true 
	},
	journal: {
		type: Schema.Types.ObjectId, 
		ref: "AccountJournal",
		required: "Journal is required",
		index: true 
	},
	unit: {
		type: Schema.Types.ObjectId, 
		ref: "AccountUnit",
		required: "Unit is required",
		index: true 
        
	},
	accountPeriod: { 
		type: Number, 
		index: true 
	},
	narration: {
		type: String,
		trim: true,
	},
	date: {
		type: Date, default: new Date(), index: true
	},
	deleteFlag: {
		type: Boolean, default: false, index: true
	},
}, {
	timestamps: true
});

// Add full-text search index
AccountPostingSchema.index({
	"narration": "text",
});

module.exports = mongoose.model("AccountPosting", AccountPostingSchema);