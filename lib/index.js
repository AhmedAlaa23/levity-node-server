import http from 'http';
import url from 'url';
import path from 'path';

import {getFile, assembleFile} from './lib/static-files.js';
import routerController from './lib/router.js';
import response from './lib/response.js';

const Application = () => {

	let isStaticEnabled = false;
	let staticRoot = 'public';
	let staticIndex = 'index.html';
	let static404 = '404.html';
	let staticOptions = {isFileEmbedEnabled: true};
	let AccessControlAllowOrigin = undefined;

	let router = {};

	var controller = async (req,res)=>{
		
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

		let routerRes;
		try{
			routerRes = await routerController({req, res, router, options:{AccessControlAllowOrigin}});
		}catch(e){console.log(e)}

		if(routerRes.status == 'ok'){
			routerRes.methodUserController(routerRes.appRequest, routerRes.appResponse);
			return;
		}
		else if(routerRes.status == 'err'){
			if(router.errHandler !== undefined && typeof(router.errHandler) === "function" ){
				// call the user err handler if set
				router.errHandler(routerRes.err, routerRes.route, response(res));
			}else{
				// call default err handler
				response(res).errJson({err: routerRes.err});
			}
			return;
		}
		else if(routerRes.status == 'pass'){
			// no route was found
			// do nothing
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
		setStaticState: (status=true)=>{isStaticEnabled = status},

		static: (root=staticRoot, index=staticIndex, page404Name=static404, options={...staticOptions}) => {
			isStaticEnabled = true;
			staticRoot = root;
			staticIndex = index;
			static404 = page404Name;
			staticOptions = options;
		},

		setAccessControlAllowOrigin: (AccessControlAllowOriginValue)=>{AccessControlAllowOrigin = AccessControlAllowOriginValue;},

		setRouter: (routerObj={})=>{router = routerObj},

		server: http.createServer(controller),
		listen: function(port){this.server.listen(port)},
	}
}

// =========================

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

	return fileData;
}

export default Application