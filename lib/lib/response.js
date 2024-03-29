function response({res, accessControlHeaders={}}){

	const setResponseAccessControlHeaders = (accessControlHeaders)=>{
		if(accessControlHeaders?.AccessControlAllowOrigin){
			res.setHeader('Access-Control-Allow-Origin', accessControlHeaders.AccessControlAllowOrigin);
		}
		if(accessControlHeaders?.AccessControlAllowMethods){
			res.setHeader('Access-Control-Allow-Methods', accessControlHeaders.AccessControlAllowMethods);
		}
		if(accessControlHeaders?.AccessControlAllowHeaders){
			res.setHeader('Access-Control-Allow-Headers', accessControlHeaders.AccessControlAllowHeaders);
		}
		if(accessControlHeaders?.AccessControlMaxAge){
			res.setHeader('Access-Control-Max-Age', accessControlHeaders.AccessControlMaxAge);
		}
	}

	const setResponseHeaders = (headers)=>{
		if(headers){
			for(const [headerKey, headerValue] of Object.entries(headers)){
				res.setHeader(headerKey, headerValue);
			}
		}
	}
	//*=========================================================

	let resJson = function(jsonRes, options={status:200, headers:undefined}){
		setResponseAccessControlHeaders(accessControlHeaders);
		setResponseHeaders(options?.headers);
		res.writeHead(options.status, {'Content-Type': 'application/json; charset=UTF-8'});
		res.write(JSON.stringify(jsonRes));
		res.end();
	}

	let resText = function(textRes, options={status:200}){
		setResponseAccessControlHeaders(accessControlHeaders);
		setResponseHeaders(options?.headers);
		res.writeHead(options.status, {'Content-Type': 'text/plain; charset=UTF-8'});
		res.write(textRes);
		res.end();
	}

	let resHTML = function(HTML, options={status:200}){
		setResponseAccessControlHeaders(accessControlHeaders);
		setResponseHeaders(options?.headers);
		res.writeHead(options.status, {'Content-Type': 'text/html; charset=UTF-8'});
		res.write(HTML);
		res.end();
	}

	let resErrJson = function(jsonErr, options={status:400}){
		setResponseAccessControlHeaders(accessControlHeaders);
		setResponseHeaders(options?.headers);
		res.writeHead(options.status, {'Content-Type': 'application/json; charset=UTF-8'});
		res.write(JSON.stringify(jsonErr));
		res.end();
	}

	let respond = function({status=200, contentType, body='', headers}){
		setResponseAccessControlHeaders(accessControlHeaders);
		setResponseHeaders(headers);
		if(contentType){
			res.setHeader('Content-Type', `${contentType} charset=UTF-8`);
		}
		res.writeHead(status);
		res.write(body);
		res.end();
	}

	return{
		raw: res,
		respond: respond,
		json: resJson,
		text: resText,
		html: resHTML,
		errJson: resErrJson,
	}
}

export default response;