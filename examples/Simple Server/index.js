import Application from '../../lib/index.js';

var app = Application();

console.log("Listening at 4000");
app.listen(4000);

app.static();

app.setRouter({
	nodes: {
		'/api/users': {
			paths:{
				'/': {
					methods: {
						'GET': {handler: getUsers},
						'POST': {handler: addUser, reqContentType: 'json'}
					},
				},
				'/{id}': {
					methods: {
						"GET": {handler: getUser},
					}
				},
				'/{id}/{cat}': {
					methods: {
						'GET': {handler: getUser}
					}
				},
			},
		},
	},
	errHandler: errHandler,
	reqContentType: 'json',
});

function getUsers(req, res){

	console.log(req.query);

	console.log('get users');
	res.json([{id: 1, name: 'David'},{id: 2, name: 'felix'}]);
}

function dbGet(){
	return new Promise((resolve,reject)=>{
		setTimeout(()=>{
			resolve('David');
		}, 1000)
	});
}

async function getUser(req, res){

	let userName = await dbGet();

	console.log('get single user');
	console.log(req.params);

	res.json({id: 1, name: userName});
}

function addUser(req, res){
	console.log('add single user');

	let name = req.body.name;

	console.log(req.body.name);

	res.json({status: 'ok', id: 3, name: name});
}

function searchUsers(req,res){
	res.json({msg: 'Search Users'});
}

function getUsersTypes(req, res){
	res.json({msg: 'get users types'});
}

function getUserType(req, res){
	res.json({msg: 'get single users types'});
}

function addUserType(req, res){
	res.json({msg: 'add user type'});
}

function errHandler(err, route, res){
	console.log("err: ", err);
	// res.respond({status: 401, contentType: 'application/json', body: JSON.stringify({err: 'err'})});
	res.errJson({status: 'err', 'err': err});
}