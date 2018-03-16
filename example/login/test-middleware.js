var express = require('express');
var expAuth = require('../../express-auth.js');
var app = express();
let port = 8080;

expAuth.init(app, {
	loginRoute: '/auth/login',
	verifyUrl: 'http://localhost/auth/token_verify',
	keyName: 'tk-auth'
});

app.get('/private', expAuth.middleware, function (req, res) {
	res.send('look at me!');
});

console.log('listening at port ' + port);
app.listen(port);
