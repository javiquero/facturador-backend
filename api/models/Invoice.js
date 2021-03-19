/**
 * Invoice.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    client_name: { type: 'string' },
    client_address: { type: 'string' },
    client_nif: { type: 'string' },
    client_cp: { type: 'string' },
    client_city: { type: 'string' },
    client_province: { type: 'string' },
    client_bank: { type: 'string' },
    total: {type: 'number',
	columnType: 'float', defaultsTo: 0.00 },
    number: {
	  type: 'number',
	  columnType: 'integer',
      unique: true
    },
    color:{
      type: 'string'
    },
    date: {
		type: 'string', columnType: 'date'
    },
    notes: {
      type:'string',
      defaultsTo: ''
    },
    description: {
      type: 'string',
      defaultsTo: ''
    },
    lines: {
      collection: 'InvoiceLines',
      via: 'invoice'
	},
	company: {
		model: 'company'
	},

  },
  beforeDestroy: function(criteria, cb) {
    Invoice.find(criteria).populate('lines').exec(function (err, invoices){
      if (err) return cb(err);
      invoices.forEach(function(recordToDestroy) {
        InvoiceLines.destroy({id: _.pluck(recordToDestroy.lines, 'id')}).exec(function(err) {
          console.log('The lines associated to the invoice ' + recordToDestroy.number + ' has been deleted');
        });
      });
      cb();
    })
  }
};
