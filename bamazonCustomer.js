var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');

var table = new Table({
  head: ['id', 'product', 'department', 'price', 'quantity']
});

var table2 = new Table({
  head: ['id', 'product', 'department', 'price', 'quantity']
});

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
    var price;

    connection.query('SELECT * FROM products WHERE ?', {id: id}, function(err, result) {
      if (err) throw err

      product = result[0].product;
      price = parseFloat(result[0].price.replace(/\$|,/g, ''));

      if(quantity > result[0].quantity) {
        console.log('\n-----------------');
        console.log('Insufficient quantity!');
        console.log('-----------------\n');

        setTimeout(displayAll, 3000);
      } else {
        var newQuantity = result[0].quantity - quantity;
        var totalSale = parseInt(quantity) * price;

        connection.query('UPDATE products SET ? WHERE ?', [{quantity: newQuantity}, {id: id}], function() {
          if (err) throw err

          console.log('\n-----------------');
          console.log('You have purchased '+quantity+' units of '+product+ '.');
          console.log('Total sale: '+totalSale);
          console.log('-----------------\n');

          connection.query('UPDATE departments SET sales = sales+'+totalSale+' WHERE ?', {id: id}, function() {
            setTimeout(displayAll, 3000);
          })
        })
      }
    })
  })
}

displayAll();
