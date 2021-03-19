/**
 * ContactController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

	async getAll(req, res) {
		if (!req.isSocket) return res.status(404).send();

		let records = await Company.find({
			user: req.session.user.id
		});

        return res.json(records);
    },
    async edit(req, res) {
		if (!req.isSocket) return res.status(404).send();

		let item = req.allParams();
		item.user = req.session.user.id;
		console.log(item);
		let newItem = await Company.update({id: item.id}).set(item).fetch();
		try {
			await sails.sockets.broadcast("account"+req.session.user.id, "companies", { verb: 'updated', data: newItem });
		} catch (error) {
			sails.log.error(error)
		}
		return res.ok();
	},
	async getLogo(req, res){
		let file = req.param("file", undefined);
		if (!file) return res.status(400).send("FileName is necesary.");
		console.log(file);
		return res.sendFile( process.cwd() +'/uploadimages/'+ file)
	},
	async addLogo(req, res){
		if (req.file('logo')){
			try{
			   res.setTimeout(0);
			   let resp = await new Promise((resolve, reject)=>{
				   req.file('logo').upload({
					   dirname: '../../uploadimages/',
					   // don't allow the total upload size to exceed ~10MB
					   maxBytes: 10000000
				   }, async function whenDone(err, uploadedFiles) {
					   if (err) return reject(err);
					   if (uploadedFiles.length === 0) return reject('No file was uploaded');
					   let f = uploadedFiles[0].fd;
						 let filename = f.replace(/^.*[\\\/]/, '');
					   return resolve(filename);
				   });
			   })
			   return res.json(resp)
			}catch(err){
				sails.log.error(err)
				return res.status(500).send(err);
			}
	   }
	   return res.status(400).send();
	},
	async add(req, res) {
		if (!req.isSocket) return res.status(404).send();

		let item = req.allParams();
		console.log(item)
		item.user = req.session.user.id;
		let newItem = await Company.create(item).fetch();
		try {
			await sails.sockets.broadcast("account"+req.session.user.id, "companies", { verb: 'created', data: newItem });
		} catch (error) {
			sails.log.error(error)
		}
		return res.ok();
	},
	async remove(req, res) {
    	if (!req.isSocket) return res.status(404).send();
		let id = req.param("id", undefined);
		if (!id) return res.status(400).send("Id is necesary.");

		let destroyedRecord = await Company.destroyOne({id: id});
		if (destroyedRecord){
			try {
				await sails.sockets.broadcast("account"+req.session.user.id, "companies", { verb: 'destroyed', data: destroyedRecord });
			} catch (error) {
				sails.log.error(error)
			}
		}else{
			sails.log.error("No se ha podido eliminar la organización");
		}
		return res.ok();
	},
};

