var fs = require('fs');
var mime = require('mime-types');
var path = require('path');

function embedIncludes(data){

	//==================== includes
	var includeRegex = /{=[a-z0-9 \/._-]+=}/gi;
	var includes = data.toString().match(includeRegex);

	if(includes != null){
		for(let include of includes){
			data = data.toString().replace(include, ()=>{
				let includedFileName = global.publicPath+include.substring(2, include.length-2).trim();
				
				let includedFileData;
				try{
					includedFileData = fs.readFileSync(includedFileName);
				}catch(err){
					console.log(err);
					// if the included file not exist
					includedFileData = "404 Not Found";
				}
				return includedFileData;
			});

			// calling it recursively to make sure if there is includes inside includes (state of the art :p)
			data = embedIncludes(data);
		}
	}

	return data;
}

function assembleFile(filePath){
	
	console.log(filePath);

	var data;

	try{
		data = fs.readFileSync(filePath);
	}catch(err){
		return {status: 404, contentType: 'text/html', body: "404"};
	}

	// var parsedPath = path.parse(filePath);
	// if(parsedPath.name == "404"){
	// 	status = 404;
	// }
	// else{
	// 	status = 200;
	// }

	//==================== includes	
	data = embedIncludes(data);

	//==================== variables
	var varsRegex = /{{[a-z0-9 ._-]+}}/gi;
	var vars = data.toString().match(varsRegex);
	
	if(vars != null){
		for(let vare of vars){
			data = data.toString().replace(vare, ()=>{
				let varName = vare.substring(2, vare.length-2).trim();
				
				return global[varName];
			});
		}
	}

	return {status: 200, contentType: "text/html; charset=utf-8", body: data};
}

function getFile(fileName){
	var data;
	var contentType = mime.lookup(fileName);

	try{
		data = fs.readFileSync(fileName);
	}catch(err){
		return {status: 404, contentType: contentType, body: "404"};
	}

	return {status: 200, contentType: contentType, body: data};
}

module.exports = {getFile, assembleFile}