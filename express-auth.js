var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var auth= require('./auth.js');

var options = {
	keyName: 'auth',
	loginRoute: '/login',
	maxAge: 24 * 3600
};

exports.init = function (app, opt) {
	app.use(bodyParser.json()); /* for req.body */
	app.use(cookieParser()); /* for req.cookies */

	['keyName', 'loginRoute', 'maxAge'].forEach( function (k) {
		options[k] = opt[k] || options[k];
	});
}

exports.middleware = function (req, res, next) {
	var token = req.cookies[options['keyName']] || '';
	var authRes = auth.tokVerify(token);
	var fromUrl = encodeURI(req.url);

	if (authRes.pass) {
		return next();
	} else {
		res.redirect(options['loginRoute'] + '?next=' +
		             encodeURIComponent(fromUrl));
	}
}

exports.handleLoginReq = function (req, res) {
	var reqJson = req.body;
	var ip = req.headers['x-real-ip'] ?
	         req.headers['x-real-ip'] :
	         req.ip;

	var loginRes = auth.login(
		reqJson.username,
		reqJson.password,
		ip
	);

	res.cookie(options['keyName'], loginRes.token, {
		maxAge: options['maxAge'] * 1000,
		httpOnly: false /* prohibit js access to
		                   this cookie */
	});

	console.log(reqJson.username + ': ' + loginRes.msg);
	console.log(loginRes.perm);
	console.log(loginRes.token);
	res.json({
		"loginPass": loginRes.pass,
		"token": loginRes.token
	});
}
