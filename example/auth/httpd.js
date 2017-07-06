var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var auth= require('../../auth.js');

var app = express();
app.use(bodyParser.json()); /* for req.body */
app.use(cookieParser()); /* for req.cookies */

function require_auth(req, res, next) {
	var token = req.headers['tk-auth'] ||
	            req.cookies['tk-auth'] ||
	            '';
	var authRes = auth.tokVerify(token);
	var fromUrl = encodeURI(req.url);

	if (authRes.pass) {
		return next();
	} else {
		res.redirect('/auth.html?next=' +
		             encodeURIComponent(fromUrl));
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
		maxAge: 24 * 3600 * 1000, /* one day */
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

}).get('/private', require_auth, function (req, res) {;
	res.send('look at me!');
});

app.use(express.static('.'));
app.listen(3000);
