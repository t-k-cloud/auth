var express = require('express');
var path = require('path');
var expAuth = require('./express-auth.js');

var app = express();
let port = 3000;

expAuth.init(app, {
	keyName: 'tk-auth',
	loginRoute: 'login'
});

app.use(express.static('./web')); /* for jquery */

app.get('/', function (req, res) {
	res.sendFile(path.resolve('./web/login.html'));

}).get('/login', function (req, res) {
	res.sendFile(path.resolve('./web/login.html'));

}).post('/login_auth', function (req, res) {
	expAuth.handleLoginReq(req, res);

});

console.log('listening at port ' + port);
app.listen(port);
