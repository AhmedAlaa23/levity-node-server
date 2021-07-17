# Levity Node Server

## Simple Light Node Server

## Installation

```
$ npm install levity-server
```

## Getting Started

```javascript
import application from 'levity-server';

var app = application();

const app = application();

app.listen(3000, ()=>{
	console.log('Server Listening on 3000');
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

const searchUsers = (req,res)=>{
	console.log(req.query);
	res.json({msg: "Search Users"})
}
const addUser = (req,res)=>{
	console.log('User:', req.body.name);
	res.json({msg: "Add Users"})
}
const getUser = (req,res)=>{
	return res.json({msg: `Get Users id: ${req.params.id}`})
}
const getUserByIdAndEmail = (req,res)=>{
	return res.json({msg: `Get Users id: ${req.params.id}, email: ${req.params.email}`})
}
const editUser = (req,res)=>{
	console.log(req.body);
	return res.json({msg: `Edit Users ${req.params.id}`})
}
const deleteUser = (req,res)=>{
	return res.json({msg: `Delete Users ${req.params.id}`})
}

const getUserHTMLPage = (req,res)=>{
	return res.html(`<h1>Hello User ${req.query.name}</h1>`)
}
```