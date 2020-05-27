
function response(reqRow, reqParams=[]){
	
	let params = [];
	if(reqParams.length != 0){
		params = reqParams.map((param)=>{
			return param.slice(1,-1);
		});
	}

	let paramsValues = reqRow.url.match(route);
	console.log(paramsValues);

	return{
		row: reqRow,
		url: reqRow.url,
		method: reqRow.method,
		params: params
	}
}

module.exports = response;