

module.exports = async function (req, res, next) {
	// let token = req.param("token", undefined);
	// if (req.session && !req.session.user){
	// 	if (!token) token = req.headers.authorization;
	// 	if (token!=undefined) {
	// 		let userRecord = await User.findOne({ accessToken: token });
	// 		req.session.user = userRecord;
	// 	}
	// }
	if (req.session && !req.session.user){
		let userRecord = await User.findOne({ id: 1 });
		req.session.user = userRecord;
	}


	sails.log.info("Access (" + req.method + " " + req.protocol + ") " + req.url );
	return next();
};
