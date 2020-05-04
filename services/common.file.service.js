const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const fs = require("fs");
const path = require("path");
const settings = require("../config/settings.json");
const fileModel = require("../models/common.file.model");
const authorizationMixin = require("../mixin/authorization.mixin");
const queryMixin = require("../mixin/query.mixin");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const axios = require("axios");


module.exports = {
	name: "file",
	version: 1,
	mixins: [DbService,authorizationMixin,queryMixin],

	adapter: new MongooseAdapter(process.env.MONGO_URI || settings.mongo_uri, { "useUnifiedTopology": true }),
	model: fileModel,

	settings: {
		uploadFolder:settings.file_upload_path,
		populates: {
			"uid": {
				action: "v1.auth.get",
				params: {
					fields: "email _id"
				}
			},
		}
	},
	actions: {
		hello() {
			return "Hello File";
		},
		delete:{
			params: {
				id: "string",
			},
			async handler(ctx) {
				return new this.Promise(async(resolve, reject) => {
					const _file = await this.adapter.findOne({ _id : ctx.params.id}); 
					
					
					await fs.unlink(`${this.settings.uploadFolder}` +"/"+ `${_file.fileName}`, async (err) => {
						if (err) reject(err);
						const _file = await ctx.call("v1.file.remove", { id:ctx.params.id});
						resolve(_file);
					}); 
					
					
				});
			}
		},
		download: {
			params: {
				url: "string",
			},
			async handler(ctx) {
				const url = ctx.params.url;
				const fileName = Date.now() + this.randomName();
				const filePath = path.join(this.settings.uploadFolder, fileName);
				const writer = fs.createWriteStream(filePath);

				const response = await axios({
					url,
					method: "GET",
					responseType: "stream"
				});

				response.data.pipe(writer);
				return new Promise((resolve, reject) => {
					
					writer.on("close", () =>resolve(fileName));
					writer.on("error", err => reject(err));
				});
			}
		},
		save: {
			handler(ctx) {
				return new this.Promise(async(resolve, reject) => {

					if(ctx.params._readableState.length > 50 * 1000) throw "File upload limit exceed";
					//reject(new Error("example error"));
					const fileName = Date.now() + "_" + ctx.meta.filename || this.randomName();
					const filePath = path.join(this.settings.uploadFolder, fileName);
					const f = fs.createWriteStream(filePath);
					
					f.on("close", async () => {
						this.logger.info(`Uploaded file stored in '${filePath}'`);
						const _stats = fs.statSync(filePath);
						const _fileSizeInBytes = _stats.size / 1000;
						
						const _file = await this.adapter.insert({
							uid: ctx.params.uid, 
							name: ctx.meta.filename,
							fileName,
							size: _fileSizeInBytes,
							folder: this.settings.uploadFolder,
							type: ctx.meta.mimetype
						});
						resolve(_file);
					});
					f.on("error", err => reject(err));

					ctx.params.pipe(f);
					

				});
			}
		},
		get: {
			params: {
				filename: "string"
			},
			handler(ctx) {
				return fs.createReadStream(`${this.settings.uploadFolder}` +"/"+ `${ctx.params.filename}`);
			}
		}
	},
	methods: {
		randomName() {
			return "unnamed_" + Date.now() + ".png";
		}
	},

	hooks: {
		before: {
			"save": ["checkOwner"],	
			"get": ["checkOwner"],
			"delete": ["checkOwner"],		
		},
		after: {
			
		}
	},
};
