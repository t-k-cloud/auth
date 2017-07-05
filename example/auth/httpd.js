var express = require('express');
var bodyParser = require('body-parser');
var auth= require('../../auth.js');

var app = express();
app.use(bodyParser.json());

function require_auth(req, res, next) {
	var reqHeaders = req.headers;
	var token = reqHeaders['tk-auth'] || '';
	var authRes = auth.tokVerify(token);
	var fromUrl = encodeURI(req.url);

	if (authRes.pass) {
		return next();
	} else {
		res.cookie('tk-from', fromUrl, {
			maxAge: 10000,
			httpOnly: true }
		);

		res.redirect('/auth.html');
	}
}

app.post('/login', function (req, res) {
	var reqJson = req.body;
	var ip = req.headers['x-real-ip'] ?
	         req.headers['x-real-ip'] :
	         req.ip;

	var loginRes = auth.login(
		reqJson.username,
		reqJson.password,
		ip
	);

	res.cookie('tk-auth', loginRes.token, {
		maxAge: 10000,
		httpOnly: true }
	);

	console.log(reqJson.username + ': ' + loginRes.msg);
	console.log(loginRes.perm);
	console.log(loginRes.token);
	res.json({
		"loginPass": loginRes.pass,
		"token": loginRes.token
	});

}).get('/test_auth', function (req, res) {;
	var reqHeaders = req.headers;
	var token = reqHeaders['tk-auth'] || '';
	var authRes = auth.tokVerify(token);
	res.json(authRes);

}).get('/private', require_auth, function (req, res) {;
	res.send('look at me!');
});

app.use(express.static('.'));
app.listen(3000);
