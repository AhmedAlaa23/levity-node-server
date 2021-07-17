import application from './../../lib/index.js';

const searchUsers = (req,res)=>{
	console.log(req.query);
	return res.json({msg: "Search Users"})
}

const addUser = (req,res)=>{
	console.log('User:', req.body);
	return res.json({msg: "Add Users"})
}

const getUser = (req,res)=>{
	return res.json({msg: `Get Users id: ${req.params.id}`})
}

const getUserByIdAndEmail = (req,res)=>{
	return res.json({msg: `Get Users id: ${req.params.id}, email: ${req.params.email}`})
}

const getUserStatus = (req,res)=>{
	return res.json({msg: `Get User Status id: ${req.params.id}`})
}

const getUserStatus2 = (req,res)=>{
	return res.json({msg: `Get User Status2 id: ${req.params.id}`})
}

const editUser = (req,res)=>{
	console.log(req.body);
	return res.json({msg: `Edit Users ${req.params.id}`})
}

const deleteUser = (req,res)=>{
	return res.json({msg: "Delete Users"})
}

const getUserHTMLPage = (req,res)=>{
	return res.html(`<h1>Hello User ${req.query.name}</h1>`)
}

const searchProducts = (req,res)=>{
	return res.json({msg: "Search Products"})
}

const addProduct = (req,res)=>{
	return res.json({msg: "Add Products"})
}

const getProduct = (req,res)=>{
	return res.json({msg: "Get Products"})
}

const editProduct = (req,res)=>{
	return res.json({msg: "Edit Products"})
}

const deleteProduct = (req,res)=>{
	return res.json({msg: "Delete Products"})
}

const getGeneralReport = (req,res)=>{
	return res.json({msg: "Get General Report"})
}

const getUsersReport = (req,res)=>{
	return res.json({msg: "Get Account Report"})
}

const getProductReport = (req,res)=>{
	return res.json({msg: "Get Product Report"})
}

const app = application();

app.listen(3030, ()=>{
	console.log('Server Listening on 3030');
});

app.setRouter({
	nodes: {
		'/users': {
			paths:{
				'/': {
					methods: {
						'GET': {handler: searchUsers},
						'POST': {handler: addUser},
					},
				},
				'/{id}': {
					methods: {
						"GET": {handler: getUser},
						"PUT": {handler: editUser},
						"DELETE": {handler: deleteUser},
					}
				},
				'/{id}/{email}': {
					methods: {
						"GET": {handler: getUserByIdAndEmail},
					}
				},
				// '/{id}/status': {
				// 	methods: {
				// 		"GET": {handler: getUserStatus},
				// 	}
				// },
				// '/status/{id}': {
				// 	methods: {
				// 		"GET": {handler: getUserStatus2},
				// 	}
				// },
			},
		},
		
		'/products': {
			paths:{
				'/': {
					methods: {
						'GET': {handler: searchProducts},
						'POST': {handler: addProduct},
					},
				},
				'/{id}': {
					methods: {
						"GET": {handler: getProduct},
						"PUT": {handler: editProduct},
						"DELETE": {handler: deleteProduct},
					}
				},
			},
		},

		'/reports': {
			paths:{
				'/general': {
					methods: {
						'GET': {handler: getGeneralReport}
					}
				},
				'/users': {
					methods: {
						'GET': {handler: getUsersReport},
					}
				},
				'/products': {
					methods: {
						'GET': {handler: getProductReport},
					}
				}
			}
		},

		'/get_html_page': {
			paths:{
				'/users': {
					methods: {
						"GET": {handler: getUserHTMLPage},
					}
				}
			}
		},

	},
	
	errHandler: errHandler,
	notFoundHandler: notFoundHandler
});

app.setAccessControl({ AccessControlAllowOrigin: '*', AccessControlAllowMethods: ['GET','POST','PUT','DELETE','OPTIONS'] });
app.CORSPreFlight();

function errHandler({err, routePath, res}){
	console.log("err: ", err);
	return res.errJson({status: 'err', 'err': err});
}

function notFoundHandler({reqPath, res}){
	console.log("Not Found: ", reqPath);
	return res.respond({status: 404, contentType: 'application/json', body: JSON.stringify({status: 404, msg: 'Not Found'}) });
}