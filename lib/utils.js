const crypto = require('crypto');

export function sha1(str) {
	var md5sum = crypto.createHash('sha1');
	md5sum.update(str);
	str = md5sum.digest('hex');
	return str;
}