
const privateCollection = ["ssouser", "accessrule", ];
const prohibitedMetas = ["skipOwnerCheck"];
const prohibitedParams = ["locked","blocked"];
const limitPagesize = 20;
const defaultPagesize = 10;

module.exports = {
	methods: {
		async paramGuard(ctx, res) {
        
			///prohibited sensitive collection 
			if (ctx.params.collection) {
				if (privateCollection.indexOf(ctx.params.collection.toLowerCase().trim()) >= 0) throw "Access denied";
			}
            
			///prohibited pagesize 
			if (ctx.params.pageSize) {
				if (ctx.params.pageSize > limitPagesize) throw "Page size too large";
			}
			else {
				ctx.params.pageSize = defaultPagesize;
			}

			///prohibited bypass check 
			prohibitedParams.forEach(function(param){
				if(ctx.params[param] != null) 
					delete ctx.params[param];
    
			});

			///prohibited bypass check 
			prohibitedMetas.forEach(function(meta){
				if(ctx.meta[meta]  != null) delete ctx.meta[meta];
			});
            
		
			return res;
		},


	}
};