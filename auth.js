var fs = require('fs');
var userdb = require('./userdb.js');
var hash = require('./hash.js');
var defaultAuthLog = './auth.log';

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

exports.login = function (name, passwd, ip) {
	var msg = 'Pass authentication.';
	var pass = false;
	var perm = [];

	try {
		pass = exports.verifyUsrPasswd(name, passwd);
		if (!pass)
			msg = 'Wrong password.';
		else
			perm = userdb.getUser(name)["perm"] || [];
	} catch (e) {
		msg = e.message;
	}

	/* log */
	fs.appendFile(defaultAuthLog, ip + ' "' + name +
	              '" ' + msg + "\n");

	return {
		'pass': pass,
		'msg': msg,
		'perm': perm
	}
}
