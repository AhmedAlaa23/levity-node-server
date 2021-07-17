import http from 'http';
import url from 'url';
import path from 'path';

import {getFile, assembleFile} from './lib/static-files.js';
import routerController from './lib/router.js';
import response from './lib/response.js';

//todo: security features: requestTimeOut, responseTimeOut, maxBodySize, maxHeadersCount, maxAge

const Application = () => {

	// let isStaticEnabled = false;
	// let staticRoot = 'public';
	// let staticIndex = 'index.html';
	// let static404 = '404.html';
	// let staticOptions = {isFileEmbedEnabled: true};
	let accessControlHeaders = {};
	let isCORSPreFlightEnabled = false;

	let router = {};

	const controller = async (req, res)=>{
		// check for static files
		// if(isStaticEnabled){
		// 	if(req.method == 'GET'){
		// 		let fileData = getStaticFile(req, staticRoot, staticIndex, static404, staticOptions);

		// 		if(fileData.status == 200){
		// 			res.writeHead(fileData.status, {'Content-Type': fileData.contentType});
		// 			res.write(fileData.body);
		// 			res.end();
		// 			return;
		// 		}
		// 	}
		// }

		if(isCORSPreFlightEnabled && req.method == 'OPTIONS'){
			accessControlHeaders.AccessControlAllowHeaders = '*';
			return response({res, accessControlHeaders}).respond({status:204});
		}

		let routerResErr = null;
		const routerResolve = await routerController({req, res, router, accessControlHeaders}).catch((err)=>{
			routerResErr = err;
		});

		if(routerResErr!==null){
			return router.errHandler({err: routerResErr.msg, routePath: routerResErr.routePath, res: routerResErr.appResponse});
		}

		if(routerResolve.status==='404'){
			return router.notFoundHandler({reqPath: routerResolve.reqPath, res: routerResolve.appResponse});
		}

		return routerResolve.userMethodHandler(routerResolve.appRequest, routerResolve.appResponse);
	};

	const setAccessControl = ({AccessControlAllowOrigin, AccessControlAllowMethods, AccessControlAllowHeaders, AccessControlMaxAge})=>{
		accessControlHeaders = {AccessControlAllowOrigin, AccessControlAllowMethods, AccessControlAllowHeaders, AccessControlMaxAge};
	}

	const CORSPreFlight = ()=>{
		isCORSPreFlightEnabled = true;
	}

	return {
		// setStaticState: (status=true)=>{isStaticEnabled = status},

		// static: (root=staticRoot, index=staticIndex, page404Name=static404, options={...staticOptions}) => {
		// 	isStaticEnabled = true;
		// 	staticRoot = root;
		// 	staticIndex = index;
		// 	static404 = page404Name;
		// 	staticOptions = options;
		// },

		setAccessControl,
		CORSPreFlight,

		setRouter: (routerObj={})=>{router = routerObj},

		server: http.createServer(controller),
		listen: function(port, callback){this.server.listen(port, callback)},
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