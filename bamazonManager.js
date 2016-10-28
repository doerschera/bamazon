var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');

var table = new Table({
  head: ['id', 'product', 'department', 'price', 'quantity']
})

var connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'Bamazon'
});

function displayAll() {
  connection.query("SELECT * FROM products", function(err, result) {
    if (err) throw err;

    result.forEach(function(entry) {
      var row = [];
      row.push(entry.id);
      row.push(entry.product);
      row.push(entry.department);
      row.push(entry.price);
      row.push(entry.quantity);

      table.push(row);
    })

    console.log(table.toString())
  })
}

function displayLow() {
  connection.query('SELECT * FROM products WHERE quantity<5', function(err, result) {

    result.forEach(function(entry) {
      var row = [];
      row.push(entry.id);
      row.push(entry.product);
      row.push(entry.department);
      row.push(entry.price);
      row.push(entry.quantity);

      table.push(row);
    })

    console.log(table.toString())
  })
}

displayLow();
