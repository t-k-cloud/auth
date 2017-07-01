var jwt_raw_decode = require('jws').decode
var jwt = require('jsonwebtoken');

var secret = "OH_MY_SECRET";

var _7days_later = Math.floor(new Date().getTime()/1000) + 7*24*60*60;
var _10sec_later = Math.floor(new Date().getTime()/1000) + 10;

var token = jwt.sign({
				exp: _10sec_later,
				"loggedInAs": "wei"
			}, secret, {algorithm: 'HS256'});
console.log(token);

console.log(jwt_raw_decode(token));
console.log(jwt.decode(token));

//setTimeout(function(){
try {
	var decoded = jwt.verify(token, secret);
	console.log(decoded);
} catch (e) {
	console.log(e.message);
}
//}, 11000);

try {
	var decoded = jwt.verify('abc', secret);
	console.log(decoded);
} catch (e) {
	console.log(e.message);
}

try {
	var decoded = jwt.verify('eyJhbGciOiJIUzI1NiIsIiR5cCI6IkpXVCJ9.eyJleHAiOjE0OTg5MjU0MzEsImxvZ2dlZEluQXMiOiJ3ZWkiLCJpYXQiOjE0OTg5MjU0MjF9.v1PILL171Xe87fOE6PVj4X6OUDbeiq_eqqK9Pc69xT8', secret);
	console.log(decoded);
} catch (e) {
	console.log(e.message);
}
