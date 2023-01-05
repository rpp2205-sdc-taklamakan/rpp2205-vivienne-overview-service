const express = require('express');
const axios = require('axios');
const path = require('path');
var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

const app = express();
//const db = require('../database');
const Controller = require('./controller.js');
const bodyParser = require('body-parser');
app.use(bodyParser.json());

// app.get('/products', (req, res) =>{
//   getAllProducts(results => {
//     res.json(results);
//   })
// });

// app.get('/products', (req, res)=>{
//   res.json("hello world!");
// })
app.get('/Products', Controller.getAllProducts);
//app.get('/products/:product_id', getOneProduct);


app.get('/products/:product_id', Controller.getOneProduct);

app.get('/products/:product_id/styles', Controller.getStyles);


if (cluster.isMaster) {
  // Fork workers.
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  app.listen(3002, () => console.log('Listening at Port:3002 '));
}


