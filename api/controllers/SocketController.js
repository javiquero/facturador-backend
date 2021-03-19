/**
 * SocketController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

	async connect(req, res) {
		if (!req.isSocket) return res.status(404).send();

		var token = req.headers.authorization;
		if (!token || token == '') return res.status(403).send();

        var u = await User.findOne({ accessToken: token });
        if (!u) return res.status(403).send();

		// let config = u.config || {};
		// if (!config.selCompany) {
		// 	sails.log.error("SelCompany was not found in the user config.");
		// 	return res.status(500).send();
		// }

		// if (!config.selWarehouse) {
		// 	sails.log.error("SelWarehouse was not found in the user config.");
		// 	return res.status(500).send();
		// }

		let socketId = sails.sockets.getId(req);
		req.session.user = u;

		// if (socketId != config.socketId) {
		// 	// sails.log.info("Detected user login from another device.");
		// 	await sails.sockets.broadcast('user' + config.socketId, "exit", { reason: "Another device has logged in with the same account." });
		// 	await sails.sockets.removeRoomMembersFromRooms('user' + config.socketId, ['account'+ u.id.toString()]);
		// 	await sails.sockets.leaveAll('user' + config.socketId);

		// 	await sails.sockets.addRoomMembersToRooms(socketId, [ "account" + u.id.toString()]);



			sails.sockets.join(req, "account" + u.id.toString());
			// config.socketId = socketId;
			// await User.updateOne({ id: u.id }).set({ config: config });
    // }

    // await sails.sockets.addRoomMembersToRooms(socketId, ["userSessions" + u.id.toString()]);


		// var session = req.session;


        // let _this = this;
		// var sockets = sails.io.sockets.clients();
		// await new Promise((resolve) => {
		// 	if (!sockets.connected[socketId].rooms || !"account" + req.session.users[socketId].user.account.toString() in sockets.connected[socketId].rooms) {
		// 		sails.sockets.join(_this.req, "account" + req.session.users[socketId].user.account.toString(), function (err) {
		// 			if (err) sails.log.error(err);
		// 			resolve();
		// 		});
		// 	} else {
		// 		resolve();
		// 	}
		// });
		// await new Promise((resolve) => {
		// 	console.log("company"+req.session.users[socketId].config.selCompany.toString() in sockets.connected[socketId].rooms);
		// 	if (!"company"+req.session.users[socketId].config.selCompany.toString() in sockets.connected[socketId].rooms) {
		// 		sails.sockets.join(_this.req, "company"+req.session.users[socketId].config.selCompany.toString(), function (err) {
		// 			if (err) sails.log.error(err);
		// 			resolve();
		// 		});
		// 	} else {
		// 		resolve();
		// 	}
		// });
		// await new Promise((resolve) => {
		// 	if (!'user'+socketId in sockets.connected[socketId].rooms) {
		// 		sails.sockets.join(_this.req, 'user'+socketId, function (err) {
		// 			if (err) sails.log.error(err);
		// 			sails.sockets.addRoomMembersToRooms('user' + socketId, "company" + req.session.users[socketId].config.selCompany.toString(), "account" + req.session.users[socketId].user.account.toString(), resolve);
		// 		});
		// 	} else {
		// 		resolve();
		// 	}
		// });
		// sails.log.debug(sockets.connected);
		// sails.log.debug(sockets.connected[socketId]);
		// sails.log.debug(sockets.connected[socketId].rooms);
		return res.ok();
    }
};
