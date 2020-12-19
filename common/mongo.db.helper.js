"use strict";
const mongodb = require("mongodb");
const connectDb = async (uri) => {
	return mongodb.connect(uri, {useNewUrlParser: true,retryWrites: true});
};


const dbHelper = async (uri, func) => {
	let connection = await connectDb(uri);
	const db = connection.db();
	try{
		return await func(db,connection);
	}catch(error){
		await connection.close();
		console.log("close db");
		throw error;
	}finally{
		await connection.close();
	}
};

module.exports = dbHelper;