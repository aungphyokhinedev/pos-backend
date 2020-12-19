const sum = require("hash-sum");

const isExist = function(name,key){
    return name.indexOf(key) >= 0;
};


const keyGenerator = function(name, params, meta, keys) {
    let _key = name + ":";
   

	if(isExist(name,"posadmin")){
        
		if(isExist(name,"getbyid")){
			_key += sum(params.id + params.collection) + ":" + sum(meta);
		}
		else if(isExist(name,"getitems")) {
			_key += sum(listCashKey(params)) + ":" + sum(meta);
		}
		else if(isExist(name,"findDistinct")) {
			_key += sum(listCashKey(params)) + ":" + sum(meta);
		}
		else if(isExist(name,"salesummary")) {
			_key += sum(summaryCashKey(params)) + ":" + sum(meta);
		}
		else if(isExist(name,"saletop")) {
			_key += sum(summaryCashKey(params)) + ":" + sum(meta);
		}
		else if(isExist(name,"saledetailsummary")) {
			_key += sum(summaryCashKey(params)) + ":" + sum(meta);
		}
		else if(isExist(name,"saledetailtop")) {
			_key += sum(summaryCashKey(params)) + ":" + sum(meta);
		}
		else if(isExist(name,"ordersummary")) {
			_key += sum(summaryCashKey(params)) + ":" + sum(meta);
		}
		else if(isExist(name,"orderdetailsummary")) {
			_key += sum(summaryCashKey(params)) + ":" + sum(meta);
		}
		else{
			_key = name + ":" + sum(params);
		}
    }
    else if(isExist(name,"posfrontend")){
        if(isExist(name,"getbyid")){
			_key += sum(params.id + params.collection) + ":" + sum(meta);
		}
		else if(isExist(name,"getitems")) {
			_key += sum(listCashKey(params)) + ":" + sum(meta);
        }
        else{
			_key = name + ":" + sum(params);
		}
    }
    else if(isExist(name,"pospublic")){
        console.log("cache",name);
        if(isExist(name,"getbyid")){
			_key += sum(params.id + params.collection);
        }
      else if(isExist(name,"totalrank")) {
			_key += sum(params.transactionID + params.type);
		}
		else if(isExist(name,"getitems")) {
			_key += sum(listCashKey(params)) + ":" + sum(meta);
        }
        else{
			_key = name + ":" + sum(params);
		}
	}
	else if(isExist(name,"authorization")){
		console.log("authorization cache: ",name);
		_key = name + ":" + sum(params);
	}
	else{
		_key = name + ":" + sum(params);
	}

	// Generate a cache key
	// name - action name
	// params - ctx.params
	// meta - ctx.meta
	// keys - cache keys defined in action
	return _key;
};
module.exports = {keyGenerator};

const listCashKey = function (params) {
	return {
		collection:params.collection,
		page:params.page,
		pageSize:params.pageSize,
		populate:params.populate,
		query:params.query,
		sort:params.sort,
		search:params.search,
		searchFields:params.searchFields,
		public:params.public,
		field:params.field
	};
};

const summaryCashKey = function (params) {
	return {
		collection:params.collection,
		page:params.page,
		pageSize:params.pageSize,
		start:params.start,
		end:params.end,
		group:params.group,
		meta:params.meta,
	};
};