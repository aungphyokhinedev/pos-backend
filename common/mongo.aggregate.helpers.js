
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
const aggregates = async (params) => {
	let _params = [		
		{ $match: params.match },
		{ $group: params.group },
	];

	if(params.unwind) _params.push({$unwind : params.unwind});
	if(params.sort) _params.push({$sort : params.sort});
	if(!params.sort) _params.push({$sort : { _id : -1 }});

	if(params.pageSize && params.page){
		_params.push({$skip:  params.page >= 1 ? params.pageSize * (params.page - 1) : 0});
		_params.push({$limit: params.pageSize});
	}
	console.log("params",_params);
	
	return mongodbHelper(params.uri,async (db)=>{
		return db.collection(params.collection).aggregate(_params).toArray();

	});
	
};


module.exports = {aggregate,aggregates};