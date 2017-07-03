var express = require('express')
var bodyParser = require('body-parser');
var auth= require('../../auth.js');

var app = express();
app.use(bodyParser.json());

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

	console.log(reqJson.username + ': ' + loginRes.msg);
	console.log(loginRes.perm);
	console.log(loginRes.token);
	res.json({
		"loginPass": loginRes.pass,
		"token": loginRes.token
	});

}).get('/auth', function (req, res) {;
	var reqHeaders = req.headers;
	var token = reqHeaders['tk-auth'] || '';
	var authRes = auth.tokVerify(token);
	res.json(authRes);
});

app.use(express.static('.'));
app.listen(3000);
