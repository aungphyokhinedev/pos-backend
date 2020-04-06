module.exports = {
	methods: {
		async checkOwner(ctx) {
	
			if (!ctx.meta.authorization)
				throw new Error("Access Token is missing");
			//decode token
			const _data = await ctx.call("v1.authorization.resolveToken", { jwtToken: ctx.meta.authorization });
			if(!_data)
				throw new Error("Unauthenticated");
			const _user = await ctx.call("v1.auth.get", { id: _data._id });
			if(!_user)
				throw new Error("Unauthenticated");
		
			if(_data.token != _user.token)
				//throw new Error("Token is expired");
			
			if(_user.locked)
				throw new Error("User is locked");
			if(_user.blocked)
				throw new Error("User is blocked");
			
		
			// put user id in service meta
			// eslint-disable-next-line require-atomic-updates
			ctx.params.uid = _user._id;
			return _user;
			
		},
		async getAccess(ctx)
		{
			const _user = await this.checkOwner(ctx);
			const _access = await ctx.call("v1.authorization.getAccess", { 
				userid: _user._id,
				service:this.name,
				application:"*"
			});
			return _access;

		},
		async canRead(ctx) {
			const _access = await this.getAccess(ctx);
			if(!_access.read){
				throw new Error("Without permission(read)");
			}
		},
		async canWrite(ctx) {
			const _access = await this.getAccess(ctx);
			const _permit = _access.create || _access.update || _access.delete;
			if(!_permit ){
				throw new Error("Without permission(write)");
			}
		},
		async canCreate(ctx) {
			const _access = await this.getAccess(ctx);
			if(!_access.create){
				throw new Error("Without permission(create)");
			}
		},
		async canUpdate(ctx) {
			const _access = await this.getAccess(ctx);
			if(!_access.update){
				throw new Error("Without permission(update)");
			}
		},
		async canDelete(ctx) {
			const _access = await this.getAccess(ctx);
			if(!_access.delete){
				throw new Error("Without permission(delete)");
			}
		},
		
	}
};