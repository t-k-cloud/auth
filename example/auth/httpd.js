var express = require('express')
var bodyParser = require('body-parser');
var auth = require('../../auth.js');

var app = express();
app.use(bodyParser.json());

app.post('/login', function (req, res) {
	var reqJson = req.body;
	var ip = req.headers['x-real-ip'] ?
	         req.headers['x-real-ip'] :
	         req.ip;

	var authRes = auth.login(
		reqJson.username,
		reqJson.password,
		ip
	);

	console.log(reqJson.username + ': ' + authRes.msg);
	console.log(authRes.perm);
	res.json({"authPass": authRes.pass});
})

app.use(express.static('.'));
app.listen(3000);
