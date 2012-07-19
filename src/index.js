var ffi = require('ffi')
var lib = ffi.Library(null, {
	popen: ['pointer', ['string', 'string']],
	pclose: ['void', ['pointer']],
	fgets: ['string', ['string', 'int', 'pointer']]
});

function execSync(cmd, cb) {
	var buffer = new Buffer(1024);
	var result;
	var ph = lib.popen(cmd, 'r');
	if (!ph) {
		throw new Error('execSync error calling: ' + cmd);
	}
	if (typeof cb === 'undefined') {
		result = "";
		while(lib.fgets(buffer, 1024, ph)) {
			result += buffer.readCString();
		}
	} else {
		result = null;
		while(lib.fgets(buffer, 1024, ph)) {
			cb(buffer.readCString());
		}
	}
	lib.pclose(ph);
	return result;
}
