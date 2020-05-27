var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');

var getRawBody = require('raw-body');

var {getFile, assembleFile} = require('./lib/static-files.js');
var createAppRequest = require('./lib/request.js');
var createAppResponse = require('./lib/response.js');


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
					return;
				}
			}
		}

		//============= assemble routes routes
		let routes = {};

		for( let [node, nodeObj] of Object.entries(router.nodes) ){

			for( let [path, pathObj] of Object.entries(nodeObj.paths) ){
				let routePath = '';
				let routeRegex = '';
				let params = [];

				if(path == '/'){
					// default root
					// routePath = `${node}(/?)$`;
					routePath = `${node}`;
					routeRegex = `${node}$`;
				}
				else{
					let paramsFromUrl = path.match(/\{(.*?)\}/g);
					params = [...paramsFromUrl];
					// example: '/api/products/[^/]+/[^/]+$'
					routePath = `${node}${path}`;
					routeRegex = `${node}${path}$`.replace(/\{(.*?)\}/g, '[^/]+');
				}

				routes[routePath] = {
					routeRegex: routeRegex,
					methods: pathObj.methods,
					params: params
				};
			}
		}
		// =========================

		//=========== check for the routes
		for(let route in routes){
			if( req.url.match(routes[route].routeRegex) !== null ){
				if(req.method in routes[route].methods || req.method.toLowerCase() in routes[route].methods){
					let methodUserController = routes[route].methods[`${req.method}`];
					let appRequest = createAppRequest(req, route, [...routes[route].params]);
					// let appResponse = createAppResponse(req, route, [...routes[route].params]);
					
					methodUserController(appRequest, res);
					return;
				}
			}
		}
		// =======================

		//========== 404
		if(req.method == 'GET'){
			let page404Path = `${staticRoot}/${static404}`;
			let fileData = getFile(page404Path);

			// 404 of 404
			if(fileData.status == 404){
				res.writeHead(404, {'Content-Type': 'text/html'});
				res.write("404");
				res.end();
				return;
			}

			res.writeHead(404, {'Content-Type': 'text/html'});
			res.write(fileData.body);
			res.end();
			return;
		}
		else{
			res.writeHead(404, {'Content-Type': 'text/json'});
			res.write(JSON.stringify({status: '404', error: '404'}));
			res.end();
		}
		// =================

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

	if(pathName == "/"){filePath += staticIndex}
	
	let pathExt = path.parse(filePath).ext;
	if(pathExt == ""){filePath += ".html"}

	let fileExt = path.extname(filePath);
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