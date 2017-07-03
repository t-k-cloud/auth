var userdb = require('./userdb.js');
var prompt = require('prompt');

prompt.start();
prompt.get(['username',
		{name: 'password', hidden: true},
		{name: 'password_again', hidden: true},
	], function(err, ret) {
		try {
			if (ret.password != ret.password_again)
				throw Error('two password does not match!');

			userdb.updateUsrPass(ret.username, ret.password);
			console.log(userdb.getUser(ret.username));
		} catch (e) {
			console.log(e.message);
		}
});
