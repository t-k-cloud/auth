var crypto = require("crypto");

function hashSha256(string) {
	return crypto.createHmac("sha256", string).digest("hex");
}

exports.hashPasswd = function (user, passwd, salt) {
	return hashSha256(passwd + salt + user);
};

exports.genSalt = function () {
	return crypto.randomBytes(4).toString("hex");
}
