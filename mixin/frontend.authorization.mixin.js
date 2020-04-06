module.exports = {
	methods: {
		async checkUser(ctx) {
	
			if (!ctx.meta.authorization)
				throw new Error("Access Token is missing");
			//decode token
			const _data = await ctx.call("v1.authorization.resolveToken", { jwtToken: ctx.meta.authorization });
			if(!_data)
                throw new Error("Unauthenticated");
			const _user = await ctx.call("v1.auth.get", { id: _data._id });
			if(!_user)
				throw new Error("Unauthenticated");	
		
			// put user id in service meta
			// eslint-disable-next-line require-atomic-updates
            ctx.params.uid = _user._id;
			// eslint-disable-next-line require-atomic-updates
			ctx.params.owner = _data.owner;
            // eslint-disable-next-line indent
            // eslint-disable-next-line require-atomic-updates
            ctx.params.user = _data.user;
			return _user;
			
		},
	
		
	}
};