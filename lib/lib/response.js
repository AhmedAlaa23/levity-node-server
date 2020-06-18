
function response(res){
	
	let resJson = function(jsonRes){
		res.writeHead(200, {'Content-Type': 'application/json; charset=UTF-8'});
		res.write(JSON.stringify(jsonRes));
		res.end();
	}

	let resText = function(textRes){
		res.writeHead(200, {'Content-Type': 'text/plain; charset=UTF-8'});
		res.write(textRes);
		res.end();
	}

	let resErrJson = function(jsonErr){
		res.writeHead(400, {'Content-Type': 'application/json; charset=UTF-8'});
		res.write(JSON.stringify(jsonErr));
		res.end();
	}

	let respond = function(responseData = {status: 200, contentType: 'application/json', body: {}}){
		res.writeHead(responseData.status, {'Content-Type': `${responseData.contentType}; charset=UTF-8`});
		res.write(responseData.body);
		res.end();
	}

	return{
		row: res,
		respond: respond,
		json: resJson,
		text: resText,
		errJson: resErrJson
	}
}

export default response;