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

function inquire() {
  inquirer.prompt([
    {
      message: 'What is the id of the product you would like to purchase?',
      name: 'id'
    },
    {
      message: 'How many units would like to purchase?',
      name: 'quantity'
    }
  ]).then(function(response) {
    var id = parseInt(reponse.id);
    var quantity = response.quantity;

    connection.query('SELECT * FROM products WHERE ?', {id: id}, function(err, result) {
      if(quantity > result[0].quantity) {
        console.log('/n-----------------');
        console.log('Insufficient quantity!');
        console.log('/n-----------------');
        displayAll();
        inquire();
      }
    })
  })
}

displayAll();
