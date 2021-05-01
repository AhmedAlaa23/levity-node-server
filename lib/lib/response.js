function response({res, accessControlHeaders={}}){

	const setResponseAccessControlHeaders = (accessControlHeaders)=>{
		if(accessControlHeaders.AccessControlAllowOrigin){
			res.setHeader('Access-Control-Allow-Origin', accessControlHeaders.AccessControlAllowOrigin);
		}
		if(accessControlHeaders.AccessControlAllowMethods){
			res.setHeader('Access-Control-Allow-Methods', accessControlHeaders.AccessControlAllowMethods);
		}
		if(accessControlHeaders.AccessControlAllowHeaders){
			res.setHeader('Access-Control-Allow-Headers', accessControlHeaders.AccessControlAllowHeaders);
		}
		if(accessControlHeaders.AccessControlMaxAge){
			res.setHeader('Access-Control-Max-Age', accessControlHeaders.AccessControlMaxAge);
		}
	}

	let resJson = function(jsonRes){
		setResponseAccessControlHeaders(accessControlHeaders);
		res.writeHead(200, {'Content-Type': 'application/json; charset=UTF-8'});
		res.write(JSON.stringify(jsonRes));
		res.end();
	}

	let resText = function(textRes){
		setResponseAccessControlHeaders(accessControlHeaders);
		res.writeHead(200, {'Content-Type': 'text/plain; charset=UTF-8'});
		res.write(textRes);
		res.end();
	}

	let resErrJson = function(jsonErr){
		setResponseAccessControlHeaders(accessControlHeaders);
		res.writeHead(400, {'Content-Type': 'application/json; charset=UTF-8'});
		res.write(JSON.stringify(jsonErr));
		res.end();
	}

	let respond = function({status=200, contentType, body=''}){
		setResponseAccessControlHeaders(accessControlHeaders);
		if(contentType){
			res.setHeader('Content-Type', `${contentType} charset=UTF-8`);
		}
		res.writeHead(status);
		res.write(body);
		res.end();
	}

	return{
		row: res,
		respond: respond,
		json: resJson,
		text: resText,
		errJson: resErrJson,
	}
}

export default response;