import url from 'url';
import createAppRequest from './request.js';
import createAppResponse from './response.js';

const assembleRoutesData = (router)=>{
	let routes = {};
	
	for( let [node, nodeObj] of Object.entries(router.nodes) ){
		for( let [path, pathObj] of Object.entries(nodeObj.paths) ){
			let routePath = '';
			let routePathRegex = '';
			let params = [];

			routePath = `${node}${path}`;
			routePathRegex = `${node}${path}$`.replace(/\{(.*?)\}/g, '[^/]?');
			
			let paramsFromUrl = path.match(/\{(.*?)\}/g);
			if(paramsFromUrl){ params = [...paramsFromUrl]; }
			
			routes[routePath] = {
				methods: {...pathObj.methods},
				routePathRegex,
				params
			}
		}
	}

	return routes;
}

const getRouterRouteData = (routes, req)=>{
	//* match the request path with the routes
	const baseURL = `http://${req.headers.host}/`;
	const reqPathName = new URL(req.url, baseURL).pathname;
	const reqMethod = req.method;

	for(let route in routes){
		if( reqPathName.match(routes[route].routePathRegex) !== null ){
			if(reqMethod in routes[route].methods){
				return {
					userMethodHandler: routes[route].methods[reqMethod].handler,
					routePath: route
				}
			}
		}
	}

	return null;
}

async function routerController({req, res, router, accessControlHeaders}){
	const appResponse = createAppResponse({res, accessControlHeaders});

	const routes = assembleRoutesData(router);

	const routerRouteData = getRouterRouteData(routes, req);
	if(routerRouteData === null){
		const reqPath = new URL(req.url, `http://${req.headers.host}/`).pathname;
		return {status: '404', reqPath, appResponse}
	}

	const {userMethodHandler, routePath} = routerRouteData;
	
	const appRequest = await createAppRequest({reqRow: req, routePath, reqParamsArr: [...routes[routePath].params], reqContentType: 'application/json'}).catch((err)=>{
		throw {msg: err.msg, routePath, appResponse};
	});
	
	return {status:'ok', userMethodHandler, appRequest, appResponse};
}

export default routerController