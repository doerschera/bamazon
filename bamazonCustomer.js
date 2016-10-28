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

    inquire();
    return false;
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
    var id = parseInt(response.id);
    var quantity = parseInt(response.quantity);
    var product;

    connection.query('SELECT * FROM products WHERE ?', {id: id}, function(err, result) {
      if (err) throw err

      product = result[0].product;

      if(quantity > result[0].quantity) {
        console.log('\n-----------------');
        console.log('Insufficient quantity!');
        console.log('-----------------\n');

        setTimeout(displayAll, 3000);
      } else {
        var newQuantity = result[0].quantity - quantity;

        connection.query('UPDATE products SET ? WHERE ?', [{quantity: newQuantity}, {id: id}], function() {
          if (err) throw err

          console.log('\n-----------------');
          console.log('You have purchased '+quantity+' units of '+product+ '.');
          console.log('-----------------\n');

          setTimeout(displayAll, 3000);
        })
      }
    })
  })
}

displayAll();
