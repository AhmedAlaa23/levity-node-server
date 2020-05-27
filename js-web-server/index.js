var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');

var getRawBody = require('raw-body');

var {getFile, assembleFile} = require('./static-files.js');


const Application = () => {

	let isStaticEnabled = true;
	let staticRoot = 'public';
	let staticIndex = 'index.html';
	let static404 = '404.html';
	let staticOptions = {isFileEmbedEnabled: true};

	let router = {};

	var controller = (req,res)=>{
		
		// check for static files
		if(isStaticEnabled){
			if(req.method == 'GET'){
				let fileData = getStaticFile(req, staticRoot, staticIndex, static404, staticOptions);
				
				if(fileData.status == 200){
					res.writeHead(fileData.status, {'Content-Type': fileData.contentType});
					res.write(fileData.body);
					res.end();
				}
			}
		}

		// routers
		for(let node in router.nodes){

			if( node.includes(req.url) ){

				if( req.method in router.nodes[`${req.url}`].methods || req.method.toLowerCase() in router.nodes[`${req.url}`].methods ){
					if(node == req.url){
						let nodeMethod = router.nodes[`${req.url}`].methods[`${req.method}`];
						nodeMethod.default(req,res);
					}
					else{

						

					}
				}

			}

		}

		if(req.url in router.nodes){
			if( req.method in router.nodes[`${req.url}`].methods || req.method.toLowerCase() in router.nodes[`${req.url}`].methods ){

				let nodeMethod = router.nodes[`${req.url}`].methods[`${req.method}`];
				nodeMethod.default(req,res);

			}
		}

	};

	return {
		setStaticEnabled: (status=true)=>{isStaticEnabled = status},

		static: (root=staticRoot, index=staticIndex, page404Name=static404, options={...staticOptions}) => {
			staticRoot = root;
			staticIndex = index;
			static404 = page404Name;
			staticOptions = options;
		},

		setRouter: (routerObj={})=>{router = routerObj},

		server: http.createServer(controller),
		listen: function(port){this.server.listen(port)},
	}
}

function getStaticFile(req, staticRoot, staticIndex, static404, staticOptions){
	let pathName = url.parse(req.url, true).pathname;
	let filePath = staticRoot + pathName;
	let page404Path = staticRoot + static404;
	let pathExt = path.parse(pathName).ext;

	if(pathName == "/"){filePath += staticIndex}
	if(pathExt == ""){filePath += ".html"}

	var fileExt = path.extname(filePath);
	let fileData;
	if( staticOptions.isFileEmbedEnabled && fileExt == ".html" ){
		fileData = assembleFile(filePath);
	}
	else{
		fileData = getFile(filePath);
	}

	// // 404
	// if(fileData.status == 404){
	// 	fileData = getFile(page404Path);
	// 	// 404 of 404
	// 	if(fileData.status == 404){

	// 	}
	// }

	return fileData;
}

// export default Application
module.exports = Application