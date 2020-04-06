module.exports = {
	methods: {
		async hideDelete(ctx) {
			let _query = ctx.params.query ? ctx.params.query: {};
			_query.deleteFlag = {$ne:true};
			ctx.params.query = _query;
			
		},
		
		
	}
};