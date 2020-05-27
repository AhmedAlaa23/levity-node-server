var Application = require('./framework/index.js');

var app = Application();

console.log("Listening at 4000");
app.listen(4000);

app.setRouter({
	nodes: {
		'/api/products': {
			methods: {
				'GET': {
					default: getProducts,
					params: {
						'/id': getProduct,
						'/id/cat': getProduct,
					}
				},
				'POST': {
					default: addProduct,
					params: {},
				},
			}
		}
	}
});

function getProducts(req, res){
	console.log('get products');
	res.write('api get products');
	res.end();
}

function getProduct(req, res){
	res.write('api get single product');
	res.end();
	console.log('get single product');
}

function addProduct(req, res){
	res.write('api add product');
	res.end();
	console.log('add single product');
}