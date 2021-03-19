module.exports = async function (req, res, next) {
	sails.log.info("(" + req.method + " " + req.protocol + ") " + req.url + " - " + req.ip+"\n");
	return next();
}