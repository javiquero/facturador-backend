/**
 * ProductController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
	async getById(id, company) { 
		return  await Product.findOne({
			id: id,
			company: company,
			deleted: 0
		}).populate("warehouse").populate("photos", {
			where: {
				deleted: 0
			},
			sort:  [{
				isDefault: 'DESC'
			}]
		});
	},
	async getAllProducts(company) { 
		return await Product.find({
			company: company,
			deleted: 0
		}).populate("warehouse").populate("photos", {
			where: {
				deleted: 0
			},
			sort:[{
				isDefault: 'DESC'
			}]
		});
	},
	async add(req, res) { 
		let socketId = sails.sockets.getId(req);
		let item = {
			name: 'Nuevo producto',
			company: req.session.users[socketId].config.selCompany,
			warehouse: req.session.users[socketId].config.selWarehouse
		}
		item.sku = await this['product/_getfreesku']();
		let newItem = await Product.create(item).fetch();
		// let record = await this['product/getById'](newItem.id, req.session.users[socketId].config.selCompany)
		 await sails.sockets.broadcast("company"+req.session.users[socketId].config.selCompany, "products", { verb: 'created', data: newItem });
		return res.json({ id:newItem.id });
	},
	async getAll(req, res) {
		let socketId = sails.sockets.getId(req);
		let records = await this['product/getallproducts'](req.session.users[socketId].config.selCompany);
        return res.json(records);
    },
    async edit(req, res) {
		let item = req.allParams();
		if (!item || !item.id) return res.status(500).send('Invalid product, the changes could not be saved.');
		let socketId = sails.sockets.getId(req);
		await Product.updateOne({id: item.id}).set(item);
		let record = await this['product/getById'](item.id, req.session.users[socketId].config.selCompany)
		await sails.sockets.broadcast("company"+req.session.users[socketId].config.selCompany, "products", { verb: 'updated', data: record });
        return res.ok();
    },
	async _add(req, res) {
		let item = req.allParams();
		let socketId = sails.sockets.getId(req);

		item.company = req.session.users[socketId].config.selCompany;
		item.warehouse = req.session.users[socketId].config.selWarehouse;

		if (!item.sku || item.sku == 0) item.sku = await this['product/_getfreesku']();
		//._getFreeSKU();
		let newItem = await Product.create(item).fetch();
		
		let record = await this['product/getById'](newItem.id, req.session.users[socketId].config.selCompany)
		await sails.sockets.broadcast("company"+req.session.users[socketId].config.selCompany, "products", { verb: 'created', data: record });
        return res.ok();
	},
	async remove(req, res) {
		let id = req.param("id", undefined);
		if (!id) return res.status(500).send('The id of the product is necessary.');
		let socketId = sails.sockets.getId(req);
		let p = await Product.findOne({ id: id, company: req.session.users[socketId].config.selCompany });
		if (p) {
			await Product.updateOne({ id: id }).set({ deleted: Date.now() });
			await sails.sockets.broadcast("company" + req.session.users[socketId].config.selCompany, "products", { verb: 'destroyed', data: p });
			return res.ok();
		} else { 
			return res.badRequest('Invalid photo ID');
		}
	},
	async _getFreeSKU() { 
		sails.log.debug("_getFreeSKU");
		let t = await Product.find({}).sort('sku DESC');
		if (t && t.length)  {
			return t[0].sku + 1;
		} else { 
			return 1;
		}
	}

};
