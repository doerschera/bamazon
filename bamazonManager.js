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

function addToInventory(id, amount) {
  connection.query('SELECT * FROM products WHERE ?', {id: id}, function(err, response) {
    var quantity = response[0].quantity;
    var newQuantity = quantity + amount;
    var product = response[0].product;

    connection.query('UPDATE products SET ? WHERE ?', [{quantity: newQuantity}, {id: id}], function() {
      console.log('\n------------------------------------------------------');
      console.log('You have added '+amount+' units to '+product+ '.');
      console.log('Total units: '+newQuantity);
      console.log('------------------------------------------------------\n');
      setTimeout(displayAll, 3000);
    })
  })
}

function addProduct(product, department, price, quantity) {
  connection.query('INSERT INTO products SET ?', {
    product: product,
    department: department,
    price: price,
    quantity: quantity
  }, function(err, result) {
    console.log('\n------------------------------------------------------');
    console.log(product+' has been added to the inventory.');
    console.log('------------------------------------------------------\n');
    setTimeout(displayAll, 3000);
  })
}

addProduct('semper', 'Household', '$37.50', '1');
