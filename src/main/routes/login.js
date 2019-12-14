var express = require('express');
var mustache = require('../common/mustache')
var router = express.Router();
var cookieParser = require('cookie-parser')

/* GET login page */
router.get('/', function (req, res, next) {
	res.render('base_template', {
		title: 'Login',
		body: mustache.render('login')
	})
})


/* POST login page */
router.post('/', function (req, res, next) {loginPost(req, res, next)})

function loginPost(req, res, next) {
	if (req.body.username === 'user' && req.body.password === 'password') {
		res.cookie('username', req.body.username)
		res.redirect(302, '/course/')
	} else if (req.body.username.length == 0 || req.body.password.length == 0){
		res.redirect(302, '/login?none')
	} else {
		res.redirect(302, '/login?fail')
	}
}

module.exports = {router, loginPost};

