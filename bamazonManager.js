var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');

var table = new Table({
  head: ['id', 'product', 'department', 'price', 'quantity']
})

var lowTable = new Table({
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

      lowTable.push(row);
    })

    console.log(lowTable.toString())
    inquire();
  })
}

function addToInventory(id, amount) {
  connection.query('SELECT * FROM products WHERE ?', {id: id}, function(err, response) {
    console.log(response);
    var quantity = parseInt(response[0].quantity);
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
    console.log(product+' has been added to the catalog.');
    console.log('------------------------------------------------------\n');
    setTimeout(displayAll, 3000);
  })
}

function inquire() {
  inquirer.prompt([
    {
      type: 'list',
      choices: ['view products', 'view low inventory', 'add to inventory', 'add new product'],
      message: 'What would you like to do?',
      name: 'action'
    }
  ]).then(function(response) {
    var action = response.action;

    if(action == 'view products') {
      displayAll();
    } else if(action == 'view low inventory') {
      displayLow()
    } else if(action == 'add to inventory') {
      inquirer.prompt([
        {
          message: 'What is the product id you would like to add inventory to?',
          name: 'id'
        },
        {
          message: 'How many units would you like to add?',
          name: 'amount'
        }
      ]).then(function(response) {
        var id = response.id;
        var amount = parseInt(response.amount);
        addToInventory(id, amount);
      })
    } else {
      inquirer.prompt([
        {
          message: 'What is the product name?',
          name: 'product'
        },
        {
          message: 'What is the product\'s department?',
          name: 'department'
        },
        {
          message: 'What is the product\'s price?',
          name: 'price'
        },
        {
          message: 'How many units are there?',
          name: 'quantity'
        }
      ]).then(function(response) {
        var product = response.product;
        var department = response.department;
        var price = response.price;
        var quantity = response.quantity;

        addProduct(product, department, price, quantity);
      })
    }
  })
}

inquire();
