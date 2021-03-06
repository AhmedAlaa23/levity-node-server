import url from 'url';
import createAppRequest from './request.js';
import createAppResponse from './response.js';

async function routerController({req, res, router, accessControlHeaders}){
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
				routeRegex = `${node}/?$`;
			}
			else{
				let paramsFromUrl = path.match(/\{(.*?)\}/g);
				// if there is any params in the url
				if(paramsFromUrl){ params = [...paramsFromUrl]; }
				// example: '/api/users/[^/]+/[^/]+$'
				routePath = `${node}${path}`;
				routeRegex = `${node}${path}$`.replace(/\{(.*?)\}/g, '[^/]+/?');
			}

			routes[routePath] = {
				routeRegex: routeRegex,
				methods: pathObj.methods,
				params: params
			};
		}
	}

	//====== check for routes
	for(let route in routes){
		// trim the query and hash ? & #
		let reqRoutePath = url.parse(req.url, true).pathname;
		
		if( reqRoutePath.match(routes[route].routeRegex) !== null ){
			if(req.method in routes[route].methods || req.method.toLowerCase() in routes[route].methods){
				let methodUserController = routes[route].methods[`${req.method}`].handler;
				
				let reqContentType = routes[route].methods[`${req.method}`].reqContentType || router.reqContentType || 'json';
				
				let appRequest;
				try{
					appRequest = await createAppRequest(req, route, [...routes[route].params], reqContentType);
				}catch(e){console.log(e)}
				
				let appResponse = createAppResponse({res, accessControlHeaders});

				if(appRequest.success){
					return {status: 'ok', methodUserController, appRequest: appRequest.data, appResponse};
				}
				else{
					return {status: 'err', err: appRequest.err, route};
				}

			}
		}
	}

	return {status: 'pass'};
}

export default routerController