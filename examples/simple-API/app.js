import application from './../../lib/index.js';

const searchUsers = (req,res)=>{
	res.json({msg: "Search Users"})
}

const addUser = (req,res)=>{
	res.json({msg: "Add Users"})
}

const getUser = (req,res)=>{
	res.json({msg: `Get Users id: ${req.params.id}`})
}

const editUser = (req,res)=>{
	res.json({msg: "Edit Users"})
}

const deleteUser = (req,res)=>{
	res.json({msg: "Delete Users"})
}


const searchProducts = (req,res)=>{
	res.json({msg: "Search Products"})
}

const addProduct = (req,res)=>{
	res.json({msg: "Add Products"})
}

const getProduct = (req,res)=>{
	res.json({msg: "Get Products"})
}

const editProduct = (req,res)=>{
	res.json({msg: "Edit Products"})
}

const deleteProduct = (req,res)=>{
	res.json({msg: "Delete Products"})
}

const getGeneralReport = (req,res)=>{
	res.json({msg: "Get General Report"})
}

const getAccountReport = (req,res)=>{
	res.json({msg: "Get Account Report"})
}

const getProductReport = (req,res)=>{
	res.json({msg: "Get Product Report"})
}

var app = application();


app.listen(3030);

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
				'/accounts': {
					methods: {
						'GET': {handler: getAccountReport},
					}
				},
				'/products': {
					methods: {
						'GET': {handler: getProductReport},
					}
				}
			}
		}

	},
	
	
	errHandler: errHandler,
});

app.setAccessControl({ AccessControlAllowOrigin: '*', AccessControlAllowMethods: ['GET','POST','PUT','DELETE','OPTIONS'] });
app.CORSPreFlight();

function errHandler(err, route, res){
	console.log("err: ", err);
	res.errJson({status: 'err', 'err': err});
}