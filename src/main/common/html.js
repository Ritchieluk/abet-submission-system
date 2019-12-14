module.exports.auth_wrapper = (handler) => {
	return (req, res, next) => {
		Promise.resolve(handler(req, res, next)).catch(next)
	}
}
// test
module.exports.wrapper = (handler) => {
	return (req, res, next) => {
		Promise.resolve(handler(req, res, next)).catch(next)
	}
}