var createAppRequest = require('./request.js');
var createAppResponse = require('./response.js');

async function routerController(req, res, router){
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

	//====== check for routes
	for(let route in routes){
		if( req.url.match(routes[route].routeRegex) !== null ){
			if(req.method in routes[route].methods || req.method.toLowerCase() in routes[route].methods){
				let methodUserController = routes[route].methods[`${req.method}`];
				
				let reqBodyType = 'json';
				
				let appRequest;
				try{
					appRequest = await createAppRequest(req, route, [...routes[route].params], reqBodyType);
				}catch(e){console.log(e)}

				// let appResponse = createAppResponse(req, route, [...routes[route].params]);
				let appResponse = res;

				if(appRequest.success){
					return {status: 'ok', methodUserController, appRequest: appRequest.data, appResponse};
				}
				else{
					return {status: 'err', err: appRequest.err, reqBodyType};
				}

			}
		}
	}

	return {status: 'pass'};
}

module.exports = routerController;