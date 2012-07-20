var ffi = require('ffi')
var ref = require('ref')

var lib = ffi.Library(null, {
	popen: ['pointer', ['string', 'string']],
	pclose: ['int', ['pointer']],
	fgets: ['string', ['string', 'int', 'pointer']]
});

module.exports = function execSync(cmd, cb) {
	var buffer = new Buffer(1024);
	var result;
	var ph = lib.popen(cmd + " 2>&1", 'r');
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
	var exit = lib.pclose(ph);
	return {'exit': exit, 'data': result}
}

