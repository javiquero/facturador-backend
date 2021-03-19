module.exports = {

  attributes: {
    invoice: {
      model: 'Invoice'
    },
    order: {
		type:"number",
		columnType: 'integer',
      defaultsTo: 0
    },
    quantity: {
		type:"number",
		columnType: 'float',
      defaultsTo: 0.0
    },
    product_description: {
      type: 'string',
      defaultsTo: ''
    },
    product_price: {
		type:"number",
		columnType: 'float',
      defaultsTo: 0.0
    },
    comment: {
      type: 'string',
      defaultsTo: ''
    }
  }
};
