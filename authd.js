var express = require('express');
var path = require('path');
var expAuth = require('./express-auth.js');

var app = express();
let port = 3000;

expAuth.init(app, {
	loginRoute: 'login',
	keyName: 'tk-auth'
});

app.use('/', express.static('./public')); /* for jquery */

app.get('/login', function (req, res) {
	res.sendFile(path.resolve('./public/login.html'));

}).post('/login_auth', function (req, res) {
	expAuth.handleLoginReq(req, res);

}).post('/token_verify', function (req, res) {
	expAuth.handleVerifyReq(req, res);

});

console.log('listening at port ' + port);
app.listen(port);
