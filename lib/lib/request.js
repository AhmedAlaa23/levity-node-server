import getRawBody from 'raw-body';

//todo: check for reqAcceptedContentType against accepted contentTypes (global and if any individual route has different values)
function handleRawBody(req, reqAcceptedContentType){
	return new Promise((resolve, reject)=>{
		getRawBody(req, {length: req.headers['content-length'], limit: '1mb', encoding: true}, function(err, body){
			if(err){
				console.error(err);
				reject({success: false, err: err});
			}
	
			const reqHeaders = req.headers['content-type'] ?? '';

			if( reqHeaders.toLowerCase().includes('application/json') ){
				try{
					body = JSON.parse(body);
					resolve(body)
				}catch(e){
					reject({msg: 'Invalid JSON', body})
				}
			}
			else{
				resolve(body);
			}
	
		});
	});
}

const createParamsObj = ({reqParamsArr, reqRaw, routePath}) => {
	let params = {};
	if(reqParamsArr.length != 0){
		let routeSplitted = routePath.split('/')
		let urlSplitted = reqRaw.url.split('/')

		routeSplitted.forEach((item, index) => {
			if(item.match(/\{(.*?)\}/g)){
				let paramKey = item.slice(1,-1);
				params[paramKey] = urlSplitted[index];
			}
		});
	}
	return params;
}

async function request({reqRaw, routePath, reqParamsArr=[], reqAcceptedContentType}){

	const params = createParamsObj({reqParamsArr, reqRaw, routePath});

	let rawBody = await handleRawBody(reqRaw, reqAcceptedContentType).catch((err)=>{ throw err; });
	
	const baseURL = `http://${reqRaw.headers.host}/`;
	const urlSearchParams = new URL(reqRaw.url, baseURL).searchParams;
	const query = Object.fromEntries(urlSearchParams);

	return{
		raw: reqRaw,
		headers: reqRaw.headers,
		url: reqRaw.url,
		method: reqRaw.method,
		params: params,
		query: query,
		body: rawBody
	}
}

export default request;