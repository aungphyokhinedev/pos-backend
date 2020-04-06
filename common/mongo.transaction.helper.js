"use strict";

const mongodbHelper = require("./mongo.db.helper");
const transactionHelper = async (uri,transactionAllow, func) => {
	return mongodbHelper(uri,async (db,connection)=>{
		const session = await connection.startSession();
		await session.startTransaction();
		let opts = transactionAllow ? {session, returnOriginal: false} : {};
		try{
			let _result = await func(db,opts);
			await session.commitTransaction();
			session.endSession();
			connection.close();
			return _result;
		}
		catch(error) {
			// If an error occurred, abort the whole transaction and undo any changes that might have happened
			await session.abortTransaction();
			await session.endSession();
			throw error; // Rethrow so calling function sees error
		}

	});
	
};

module.exports = transactionHelper;