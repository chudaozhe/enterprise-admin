const host = function(){
	let ln = window.location;
	console.log(ln.href.indexOf("localhost"))
	return ln.href.indexOf("localhost") > 0 ? 'http://localhost:5173' : "https://ent.uqiantu.com";
};
export default {
	baseURL: host()
};