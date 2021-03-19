/**
 * CustomerController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

	async getAll(req, res) {
		if (!req.isSocket) return res.status(404).send();

		let records = await Client.find({
			user: req.session.user.id
		})

        return res.json(records);
    },
    async edit(req, res) {
		if (!req.isSocket) return res.status(404).send();

		let item = req.allParams();
		item.user = req.session.user.id;
		let newItem = await Client.update({id: item.id}).set(item).fetch();
		try {
			await sails.sockets.broadcast("account"+req.session.user.id, "clients", { verb: 'updated', data: newItem });
		} catch (error) {
			sails.log.error(error)
		}
		return res.ok();
    },
	async add(req, res) {
		if (!req.isSocket) return res.status(404).send();

		let item = req.allParams();
		item.user = req.session.user.id;
		let newItem = await Client.create(item).fetch();
		try {
			await sails.sockets.broadcast("account"+req.session.user.id, "clients", { verb: 'created', data: newItem });
		} catch (error) {
			sails.log.error(error)
		}
		return res.ok();
	},
	async remove(req, res) {
		if (!req.isSocket) return res.status(404).send();
		let id = req.param("id", undefined);
		if (!id) return res.status(400).send("Id is necesary.");

		let destroyedRecord = await Client.destroyOne({id: id});
		if (destroyedRecord){
			try {
				await sails.sockets.broadcast("account"+req.session.user.id, "clients", { verb: 'destroyed', data: destroyedRecord });
			} catch (error) {
				sails.log.error(error)
			}
		}else{
			sails.log.error("No se ha podido eliminar el cliente");
		}
		return res.ok();
	},
};

