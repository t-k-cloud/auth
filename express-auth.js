var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var auth= require('./auth.js');
var request = require('request');

var options = {
	keyName: 'auth',
	loginRoute: '/login',
	verifyUrl: 'http://localhost/verify',
	maxAge: 24 * 3600
};

exports.init = function (app, opt) {
	app.use(bodyParser.json()); /* for req.body */
	app.use(cookieParser()); /* for req.cookies */

	const carekeys = ['keyName', 'loginRoute', 'verifyUrl', 'maxAge'];
	carekeys.forEach( function (k) {
		options[k] = opt[k] || options[k];
	});
}

exports.middleware = function (req, res, next) {
	var token = req.cookies[options['keyName']] || '';
	var fromUrl = req.header('X-original-uri') || req.url;

	// console.log(req.headers);
	console.log('fromUrl: ' + fromUrl);
	console.log('Verifing token: ' + token);

	request.post({
		"uri": options['verifyUrl'],
		"json": {"token": token}
	}, function (err, response, body) {
		if (err) {
			console.log('Failed request to ' + options['verifyUrl']);
			return res.status(500).send('authd is down.');
		}

		const authRes = body;
		if (authRes.pass) {
			return next();
		} else {
			res.redirect(options['loginRoute'] + '?next=' +
						 encodeURIComponent(fromUrl));
		}
	});
}

exports.handleVerifyReq = function (req, res) {
	var reqJson = req.body;
	var token = reqJson.token;
	var authRes = auth.tokVerify(token);
	console.log('receiving token: ' + token);
	console.log(authRes);
	res.json(authRes);
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

	console.log('login user ' + reqJson.username + ': ' + loginRes.msg);
	//console.log(loginRes.perm);
	console.log(loginRes.token);
	res.json({
		"loginPass": loginRes.pass,
		"token": loginRes.token
	});
}
