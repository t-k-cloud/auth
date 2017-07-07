var express = require('express');
var expAuth = require('../../express-auth.js');
var app = express();

expAuth.init(app, {
	keyName: 'tk-auth',
	loginRoute: 'login'
});

app.get('/login', function (req, res) {
	res.sendFile(__dirname + '/login.html');

}).post('/login_auth', function (req, res) {
	expAuth.handleLoginReq(req, res);

}).get('/private', expAuth.middleware, function (req, res) {
	res.send('look at me!');
});

app.use(express.static('.'));
app.listen(3000);
