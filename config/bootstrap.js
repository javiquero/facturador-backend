/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */

module.exports.bootstrap = async function() {

  // By convention, this is a good place to set up fake data during development.
  //
  // For example:
  // ```
  // // Set up fake development data (or if we already have some, avast)
  // if (await User.count() > 0) {
  //   return;
  // }
  //
  // await User.createEach([
  //   { emailAddress: 'ry@example.com', fullName: 'Ryan Dahl', },
  //   { emailAddress: 'rachael@example.com', fullName: 'Rachael Shaw', },
  //   // etc.
  // ]);
	let faker = require('faker');
	faker.locale = 'es';

	let numRecords = await User.count();
	if (numRecords==0){
		//   await User.destroy({});
		await  User.create({
			id: 1,
			name: 'Javier',
			surname: 'Quero',
			email: 'javiquero@gmail.com',
			lopd: false,
			emailStatus: 'confirmed',
			emailChangeCandidate: '',
			password: '$2a$10$JUmOSx.K4LPEXw01KLnyaOeXPjecoZbrR4Y3llg3BVMj08bv49upy',
			passwordResetToken: '',
			accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicHdoIjoyNTQwNzg1NTkyLCJpYXQiOjE2MTI5NzgwMTR9.VoizJSdZbVjSufCAPHbmyJENkgoHp2czA9OLhkEfp7Q',
			accessTokenExpiresAt: 1613064414938.0,
			emailProofToken: '',
			emailProofTokenExpiresAt: 0,
			tosAcceptedByIp: '::1',
			lastSeenAt: 0,
			avatar: faker.image.avatar(),
			config: null
		})
	}

	numRecords = await Country.count();
	if (numRecords==0){
		debugdata = require("../debugData/countries.js");
		await Promise.all(debugdata.map(async (item) => {
			await Country.create(item);
		}));
	}

	numRecords = await Company.count();
	if (numRecords==0){
		//   await User.destroy({});
		await  Company.create({
			id: 1,
			name: 'Empresa1',
			tradename: 'Empresa de pruebas S.L.',
			email: 'info@epruebas.com',
			phone: '93456789123',
			alias: '',
			vatnumber: '876546G',
			size: 0,
			industry: '',
			logo: '0b9b86dd-2259-41b5-acae-f466699916cf.jpg',
			color: 'blue',
			address: 'Carretera sin nombre, 23',
			city: 'Cornella del llobregat',
			cp: '08940',
			province: 'Barcelona',
			info: '',
			country: null,
			user: 1
		});
	}

	numRecords = await Client.count();
	if (numRecords==0){
		for (let i = 0; i<5; i++)
			await Client.create({
				user: 1,
				name: faker.name.findName(),
				nif:faker.finance.routingNumber(),
				address: faker.address.streetAddress(),
				city: faker.address.city(),
				cp: faker.address.zipCode(),
				province: faker.address.country(),
				info: faker.lorem.lines()
			})


	}

	// sails.log.info(" -- Client");
//   debugdata = require("../debugData/debugcontacts.js");
//   let conts = [];
//   await Client.destroy({});
//   await Promise.all(debugdata.map(async (item) => {
// 	  item.user = 1;
// 	  item.name= faker.name.findName();
// 	  item.address = adds[Math.floor(Math.random() * adds.length)].id;
// 	  let cont = await Client.create(item).fetch();
// 	  conts.push(cont);
//   }));
//   sails.log.info("-------------------------")

	// createdAt	updatedAt	id	name	tradename	email	phone	alias	vatnumber	size	industry	logo	color	address	user	city	cp	province	info	country
	// 1613148096148	1613148096148	1	Empresa1	Empresa de pruebas S.L.	info@epruebas.com	93456789123		876546G	0.0		0b9b86dd-2259-41b5-acae-f466699916cf.jpg	orange	Carretera sin nombre, 23	1	Cornella del llobregat	08940	Barcelona

//   sails.log.info(" -- Countries");
//   debugdata = require("../debugData/countries.js");
//   let countrs = [];
//   await Country.destroy({});
//   await Promise.all(debugdata.map(async (item) => {
// 	  let countr = await Country.create(item).fetch();
// 	  countrs.push(countr);
//   }));
//   sails.log.info("-------------------------")



//   sails.log.info(" -- Addresses");
//   let adds = [];
//   let nn=Math.floor(Math.random()*50);
//   for (let i = 0; i<nn; i++ ){
// 	let item = {
// 		address: faker.address.streetAddress(),
// 	  	city: faker.address.city(),
// 	  	cp: faker.address.zipCode(),
// 	  	province: faker.address.country(),
// 	  	info: faker.lorem.lines()
// 	}
// 	item.country = countrs[Math.floor(Math.random() * countrs.length)].id;
// 	let add = await Address.create(item).fetch();
// 	adds.push(add);
//   }
//   sails.log.info("-------------------------")


//   sails.log.info(" -- Companies");
//   await Company.destroy({});
//   let colors = [ 'red', 'pink', 'purple', 'indigo', 'blue', 'yellow', 'cyan', 'teal', 'orange', 'green', 'lime', 'brown' ];
//   let n=Math.floor(Math.random()*5);
//   for (let i = 0; i<n; i++ ){
// 	let item = {
// 		name: 'Empresa ' + (i+1),
// 		tradename: faker.company.companyName(),
// 		email: faker.internet.email(),
// 		phone: faker.phone.phoneNumber(),
// 		alias: 'EMP'+(i+1),
// 		vatnumber:faker.finance.routingNumber(),
// 		size: faker.random.number(10),
// 		industry: '',
// 		logo: faker.image.business(),
// 		color: colors[faker.random.number(colors.length-1)],
// 		user:1
// 	}
// 	item.address = adds[Math.floor(Math.random() * adds.length)].id;
// 	await Company.create(item);
//   }
//   sails.log.info("-------------------------")


//   sails.log.info(" -- Client");
//   debugdata = require("../debugData/debugcontacts.js");
//   let conts = [];
//   await Client.destroy({});
//   await Promise.all(debugdata.map(async (item) => {
// 	  item.user = 1;
// 	  item.name= faker.name.findName();
// 	  item.address = adds[Math.floor(Math.random() * adds.length)].id;
// 	  let cont = await Client.create(item).fetch();
// 	  conts.push(cont);
//   }));
//   sails.log.info("-------------------------")

};
