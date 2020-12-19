"use strict";

const mongodbHelper = require("./mongo.db.helper");
const distinctFind = async (params) => {
    console.log("params",params);
	return mongodbHelper(params.uri,async (db)=>{
          let _result = await db.collection(params.collection).distinct(params.field, params.query);		
          console.log("_result",_result);
          return _result;
	});
	
};



module.exports = {distinctFind};