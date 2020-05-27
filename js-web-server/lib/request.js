
function request(reqRow, route, reqParams=[]){

	// =========== assign params object =========
	let params = {};
	if(reqParams.length != 0){
		let routeSplitted = route.split('/')
		let urlSplitted = reqRow.url.split('/')

		routeSplitted.forEach((item, index) => {
			if(item.match(/\{(.*?)\}/g)){
				let paramKey = item.slice(1,-1);
				params[paramKey] = urlSplitted[index];
			}
		});
	}
	// ==================

	return{
		row: reqRow,
		url: reqRow.url,
		method: reqRow.method,
		params: params
	}
}

module.exports = request;