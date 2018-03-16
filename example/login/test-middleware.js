var express = require('express');
var expAuth = require('../../express-auth.js');
var app = express();
let port = 8080;

expAuth.init(app, {
	keyName: 'tk-auth',
	loginRoute: 'login'
});

app.get('/private', expAuth.middleware, function (req, res) {
	res.send('look at me!');
});

console.log('listening at port ' + port);
app.listen(port);
