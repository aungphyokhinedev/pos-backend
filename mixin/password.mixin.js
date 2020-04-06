module.exports = {
	methods: {
		async setPassword(ctx) {
            if(!ctx.params.email) throw new Error("Invalid Email");

            const _randompassword = await ctx.call("v1.crypto.generatePassword", { length: 7 });
					//send with email
				await ctx.call("v1.mailer.send", {
				to: ctx.params.email,
				subject: "Your login password",
				html: "Your login password is " + _randompassword
            });
            // eslint-disable-next-line require-atomic-updates
            ctx.params.password = await ctx.call("v1.crypto.hashedPassword", { data: _randompassword, saltRounds: 10 });
            return true;
		},
		async deletePassword(ctx, res) {
			delete res.password;
            return res;
		},
		
	}
};