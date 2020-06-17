var Application = require('../../lib/index.js');

var app = Application();

console.log("Listening at 4000");
app.listen(4000);

app.static();

app.setRouter({
	nodes: {
		'/api/products': {
			paths:{
				'/': {
					methods: {
						'GET': {handler: getProducts},
						'POST': {handler: addProduct, reqContentType: 'json'}
					},
				},
				'/{id}': {
					methods: {
						"GET": {handler: getProduct},
					}
				},
				'/{id}/{cat}': {
					methods: {
						'GET': {handler: getProduct}
					}
				}
			},
		},
	},
	errHandler: errHandler,
	reqContentType: 'json',
});

function getProducts(req, res){
	console.log('get products');
	res.json([{id: 1, name: 'Pixel5'},{id: 2, name: 'iPhone'}]);
}

function dbGet(){
	return new Promise((resolve,reject)=>{
		setTimeout(()=>{
			resolve('Pixel5');
		}, 1000)
	});
}

async function getProduct(req, res){

	let productName = await dbGet();

	res.json({id: 1, name: productName});

	console.log('get single product');
	console.log(req.params);

	// res.json({id: 1, name: 'Pixel4'});
}

function addProduct(req, res){
	console.log('add single product');

	console.log(req.body.name);

	res.json({status: 'ok', id: 3, name: 'iPhone12'});
}

function getProductsTypes(req, res){
	res.json({msg: 'get products types'});
}

function getProductType(req, res){
	res.json({msg: 'get single products types'});
}

function addProductType(req, res){
	res.json({msg: 'add product type'});
}

function errHandler(err, route, res){
	console.log("err: ", err);
	// res.respond({status: 401, contentType: 'application/json', body: JSON.stringify({err: 'err'})});
	res.errJson({status: 'err', 'err': err});
}