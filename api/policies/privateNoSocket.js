module.exports = async function (req, res, next) {
	sails.log.info("(" + req.method + " " + req.protocol + ") " + req.url + " - " + req.ip+"\n");
	var token = req.headers.authorization;
	if(!token){
		token = req.param("token", undefined);
		if(!token){
			sails.log.error("In Auth policie => Token is required");
			return  res.status(403).send();
		}
	}
	let userRecord;
	try {
		userRecord = await User.findOne({accessToken: token,});
	} catch (error) {
		sails.log.error(error)
		return  res.status(500).send();
	}
	if(!userRecord) {
		sails.log.error("In Auth policie => Token is inválid");
		return  res.status(403).send();
	}

	if (userRecord.accessTokenExpiresAt <= Date.now()) {
		return res.status(403).send();
	}

	if (!req.session) req.session={};
	req.session.users = req.session.users || {};
	req.session.user = userRecord;


	return next();

}
