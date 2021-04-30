import application from './../../lib/index.js';

const searchAccounts = (req,res)=>{
	res.json({msg: "Search Accounts"})
}

const addAccount = (req,res)=>{
	res.json({msg: "Add Accounts"})
}

const getAccount = (req,res)=>{
	res.json({msg: "Get Accounts"})
}

const editAccount = (req,res)=>{
	res.json({msg: "Edit Accounts"})
}

const deleteAccount = (req,res)=>{
	res.json({msg: "Delete Accounts"})
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


var app = application();


app.listen(3000);

app.setRouter({
	nodes: {
		'/users': {
			paths:{
				'/': {
					methods: {
						'GET': {handler: searchAccounts},
						'POST': {handler: addAccount},
					},
				},
				'/{id}': {
					methods: {
						"GET": {handler: getAccount},
						"PUT": {handler: editAccount},
						"DELETE": {handler: deleteAccount},
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
	},
	
	
	errHandler: errHandler,
});

app.setAccessControlAllowOrigin('*');

function errHandler(err, route, res){
	console.log("err: ", err);
	res.errJson({status: 'err', 'err': err});
}