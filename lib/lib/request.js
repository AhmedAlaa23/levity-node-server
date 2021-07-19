import getRawBody from 'raw-body';

//todo: check for reqAcceptedContentType against accepted contentTypes (global and if any individual route has different values)
function handleRowBody(req, reqAcceptedContentType){
	return new Promise((resolve, reject)=>{
		getRawBody(req, {length: req.headers['content-length'],limit: '1mb', encoding: true}, function(err, body){
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

const createParamsObj = ({reqParamsArr, reqRow, routePath}) => {
	let params = {};
	if(reqParamsArr.length != 0){
		let routeSplitted = routePath.split('/')
		let urlSplitted = reqRow.url.split('/')

		routeSplitted.forEach((item, index) => {
			if(item.match(/\{(.*?)\}/g)){
				let paramKey = item.slice(1,-1);
				params[paramKey] = urlSplitted[index];
			}
		});
	}
	return params;
}

async function request({reqRow, routePath, reqParamsArr=[], reqAcceptedContentType}){

	const params = createParamsObj({reqParamsArr, reqRow, routePath});

	let rawBody = await handleRowBody(reqRow, reqAcceptedContentType).catch((err)=>{ throw err; });
	
	const baseURL = `http://${reqRow.headers.host}/`;
	const urlSearchParams = new URL(reqRow.url, baseURL).searchParams;
	const query = Object.fromEntries(urlSearchParams);

	return{
		row: reqRow,
		url: reqRow.url,
		method: reqRow.method,
		params: params,
		query: query,
		body: rawBody
	}
}

export default request;