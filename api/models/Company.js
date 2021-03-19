/**
 * Company.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
        //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
        //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
        name: {
            type: 'string',
            required: true
        },
        tradename: {
            type: 'string'
        },
        email: {
            type: 'string'
        },
        phone: {
            type: 'string'
        },
        alias: {
            type: 'string'
        },
        vatnumber: {
            type: 'string'
        },
        size: {
            type: 'number'
        },
        industry: {
            type: 'string'
        },
        logo: {
            type: 'string'
		},
		color: {
			type:'string'
		},


		address: {
			type: 'string'
		},
		city: {
			type: 'string'
		},
		cp: {
			type: 'string'
		},
		province: {
			type: 'string'
		},
		info: {
			type:'string'
		},
        //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
        //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
        //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


        //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
        //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
		//  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

        country: {
			model: 'Country'
		},
        user: {
            model: 'user'
        },
    }
};
