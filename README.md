# Levity Node Server

## Simple Light Node Server

## Installation

```
$ npm install levity-server
```

## Getting Started

```
var Application = require('levity-server');

var app = Application();

app.listen(4000);

app.setRouter({
	nodes: {
		'/api/products': {
			paths:{
				'/': {
					methods: {
						'POST': {handler: addProduct}
						'GET': {handler: getProducts}
					},
				},
				'/{id}': {
					methods: {
						"GET": {handler: getProduct},
					}
				},
			},
		},
	},
});
```

## Simple Static Server

Any files inside the public directory will be static files
```
var Application = require('levity-server');

var app = Application();

app.listen(4000);

app.static();

```

Static function parameters
```
static(root='public', index='index.html', page404Name='404.html', options={})
```