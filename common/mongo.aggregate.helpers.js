
"use strict";

const mongodbHelper = require("./mongo.db.helper");
const aggregate = async (params) => {
	return mongodbHelper(params.uri,async (db)=>{
		return await db.collection(params.collection).aggregate([
			{ $match: params.match },
			{ $group: params.group },
		]).next();		
	});
	
};

module.exports = {aggregate};