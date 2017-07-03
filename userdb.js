var hash = require('./hash.js');
var fs = require('fs'), ini = require('ini');

var defaultCfgPath = './usrperm.cfg';

exports.usrExits = function (name) {
	var cfgtxt = fs.readFileSync(defaultCfgPath, 'utf-8');
	var config = ini.parse(cfgtxt);
	return config.hasOwnProperty(name);
};

exports.updateUsrPass = function (name, passwd) {
	var cfgtxt = fs.readFileSync(defaultCfgPath, 'utf-8');
	var config = ini.parse(cfgtxt);
	var salt = hash.genSalt();

	config[name]['hash'] = hash.hashPasswd(name, passwd, salt);
	config[name]['salt'] = salt;
	fs.writeFileSync(defaultCfgPath, ini.stringify(config));
};

exports.increseUsrAuthFails = function (name) {
	var cfgtxt = fs.readFileSync(defaultCfgPath, 'utf-8');
	var config = ini.parse(cfgtxt);

	if (config[name].hasOwnProperty('authFails')) {
		var fails = parseInt(config[name]['authFails']);
		config[name]['authFails'] = fails + 1;
	} else {
		config[name]['authFails'] = 0;
	}
	fs.writeFileSync(defaultCfgPath, ini.stringify(config));
};

exports.getUser = function (name) {
	var cfgtxt = fs.readFileSync(defaultCfgPath, 'utf-8');
	if (!exports.usrExits(name))
		throw Error('User does not exists.');

	return ini.parse(cfgtxt)[name];
};
