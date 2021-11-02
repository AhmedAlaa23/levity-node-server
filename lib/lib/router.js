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
			routePathRegex = `${node}${path}$`.replace(/\{(.*?)\}/g, '[^/]+');
			
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

const isMethodSupported = (method)=>{ return ['GET','POST','PUT','PATCH','DELETE','HEAD','OPTIONS'].includes(method); }

const getRouterRouteData = ({routes, req, router})=>{
	//* match the request path with the routes
	const baseURL = `http://${req.headers.host}/`;
	let reqPathName;
	try{ reqPathName = new URL(req.url, baseURL).pathname; }
	catch(err){ return 'err'; }
	const reqMethod = req.method;

	for(let route in routes){
		if( reqPathName.match(routes[route].routePathRegex) !== null ){
			if(reqMethod in routes[route].methods && isMethodSupported(reqMethod)){
				return {
					userMethodHandler: routes[route].methods[reqMethod].handler,
					routePath: route,
					routeAuth: routes[route].methods[reqMethod].auth ?? router.defaultAuthData
				}
			}
		}
	}

	return null;
}

async function routerController({req, res, router, accessControlHeaders}){
	const appResponse = createAppResponse({res, accessControlHeaders});

	const routes = assembleRoutesData(router);

	const routerRouteData = getRouterRouteData({routes, req, router});
	if(routerRouteData === null){
		const reqPath = new URL(req.url, `http://${req.headers.host}/`).pathname;
		return {status: '404', reqPath, appResponse}
	}
	//* if the url path is not valid example: 'localhost:3030//'
	if(routerRouteData === 'err'){
		throw {msg: 'Invalid URL', routePath: req.url, appResponse};
	}

	const {userMethodHandler, routePath, routeAuth} = routerRouteData;
	
	const appRequest = await createAppRequest({reqRaw: req, routePath, reqParamsArr: [...routes[routePath].params], reqAcceptedContentType: '*'}).catch((err)=>{
		throw {msg: err.msg, routePath, appResponse};
	});
	
	return {status:'ok', userMethodHandler, appRequest, appResponse, routePath, routeAuth};
}

export default routerController