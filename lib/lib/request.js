import url from 'url';
import getRawBody from 'raw-body';

function handleRowBody(req, reqBodyType){
	return new Promise((resolve, reject)=>{
		getRawBody(req, {length: req.headers['content-length'],limit: '1mb',encoding: true}, function(err, body){
			if(err){
				console.error(err)
				resolve({success: false, err: err})
			}
	
			if(reqBodyType == 'json' && (req.method == 'POST' || req.method == 'PUT') ){
				try{
					body = JSON.parse(body);
					resolve({success: true, body})
				}catch(e){
					resolve({success: false, err: 'Invalid JSON'})
				}
			}
			else{
				resolve({success: true, body});
			}
	
		});
	});
}

async function request(reqRow, route, reqParams=[], reqBodyType){

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

	let rawBodyRes;
	try{
		rawBodyRes = await handleRowBody(reqRow, reqBodyType);
	}catch(e){console.log(e)}

	if(!rawBodyRes.success){
		return {success: false, err: rawBodyRes.err}
	}

	let query = url.parse(reqRow.url, true).query
	console.log(query);

	return{
		success: true,
		data: {
			row: reqRow,
			url: reqRow.url,
			method: reqRow.method,
			params: params,
			query: query,
			body: rawBodyRes.body
		}
	}
}

export default request;