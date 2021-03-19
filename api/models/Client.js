/**
 * Client.js
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
        nif: {
            type: 'string'
        },
        email: {
            type: 'string'
        },
        phone: {
            type: 'string'
        },
        mobile: {
            type: 'string'
        },
        website: {
            type: 'string'
        },
        iban: {
            type: 'string'
        },
        swift: {
            type: 'string'
        },
        separef: {
            type: 'string'
        },
        sepadate: {
            type: 'string'
        },
        discount: {
            type: 'number'
        },
        notes: {
            type: 'string'
        },
        lopd: {
            type: 'boolean',
            description: 'The user has accepted the terms of the lopd data protection act.',
            extendedDescription: 'The user allows the use of their contact means to communicate with him'
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
            model: 'User'
        },
    },
    customToJSON: function() {
        return _.omit(this, ['createdAt', 'updatedAt'])
      }
};
