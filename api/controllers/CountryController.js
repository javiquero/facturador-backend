/**
 * CountryController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
	async getAll(req, res) {
		var records = await Country.find({});
        return res.json(records);
	},

};

