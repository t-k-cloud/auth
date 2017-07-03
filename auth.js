var fs = require('fs');
var jwt = require('jsonwebtoken');
var userdb = require('./userdb.js');
var hash = require('./hash.js');
var defaultLoginLog = './login.log';

var ndays_later = function (n) {
	return Math.floor(new Date().getTime() / 1000) + n * 24 * 60 * 60;
}

var nsec_later = function (n) {
	return Math.floor(new Date().getTime() / 1000) + n;
}

var memUsrPassMap = {};

exports.verifyUsrPasswd = function (name, passwd) {
	var user = userdb.getUser(name);

	/* this user has no password */
	if (user['hash'] === undefined || user['hash'] == '')
		return true;

	/* verify otherwise */
	var salt = user['salt'];
	var vrfy_hash = hash.hashPasswd(name, passwd, salt);
	return (vrfy_hash == user['hash']);
};

function gen_jwt_token(username, password,
                       perm, expire_timestamp)
{
	return jwt.sign({
		exp: expire_timestamp,
		"loggedInAs": username,
		"perm": perm,
	}, password, {algorithm: 'HS256'});
}

exports.login = function (name, passwd, ip) {
	var msg = 'Login successful.';
	var pass = false;
	var perm = [];
	var token = '';

	try {
		pass = exports.verifyUsrPasswd(name, passwd);
		if (!pass)
			msg = 'Wrong password.';
		else
			perm = userdb.getUser(name)["perm"] || [];
	} catch (e) {
		msg = e.message;
	}

	/* login log */
	fs.appendFile(defaultLoginLog, ip + ' "' + name +
	              '" ' + msg + "\n");
	/* generate token */
	if (pass) {
		token = gen_jwt_token(
			name, passwd, perm,
			//DEBUG: nsec_later(10)
			ndays_later(3)
		);

		memUsrPassMap[name] = passwd;
	}

	return {
		'pass': pass,
		'msg': msg,
		'perm': perm,
		'token': token
	}
}

function tryDecodeJWT(token) {
	var decTok = {};
	try {
		decTok = jwt.decode(token) || {};
	} catch (e) {
		; // fall through
	}

	//console.log(decTok);
	return decTok;
}

exports.tokVerify = function (token) {
	var decTok = tryDecodeJWT(token);
	var username = decTok['loggedInAs'] || '';
	var perm = decTok['perm'] || [];
	var passwd = memUsrPassMap[username] || '';
	var pass = true, msg = 'Auth successful.';

	try {
		decTok = jwt.verify(token, passwd);
	} catch (e) {
		pass = false;
		perm = [];
		msg = e.message;
	}

	return {
		'pass': pass,
		'msg': msg,
		'user': username,
		'perm': perm
	}
};
