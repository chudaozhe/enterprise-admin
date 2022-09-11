let _host = null;
const host = function(){
	if(_host) return _host;
	let ln = window.location;
	//ent.cw.net
	//http://localhost:7097
	return ln.href.indexOf("localhost") > 0 ? 'http://localhost' : "https://ent.cuiwei.net";
};
global.host = host();