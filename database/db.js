const mysql = require('mysql2');
const config = require('./config.js');
const Promise = require('bluebird');

const connection = mysql.createConnection({
  host: config.host,
  port: config.port,
  user: config.user,
  password: config.password,
  database: config.database
});

const db = Promise.promisifyAll(connection, { multiArgs: true});

db.connectAsync()
  .then(() => console.log(`Connected to MySQL as id: ${db.threadId}`))
  .catch((err) => console.log(err));


const getAllProducts = (cb) => {
  var query = "select * from Products where Product_id = 1";
  return db.query(query, (err, results) => {
            console.log('err', err);
            console.log('result', results)
           cb(results);
          });
};

const getOneProduct = (req, cb) => {
  console.log(req);
  var id = req.params;
  var query = `select * from Products join Features on Features.Prouct_id = Products.Product_Id  where Product_Id = ${id}`
  return connection.query(query, (err, results) => {
    console.log(err);
    cb(results);
  })
}

module.exports = {getAllProducts, getOneProduct};
