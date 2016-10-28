var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');

var table = new Table({
  head: ['id', 'department', 'overhead', 'sales']
});

var table2 = new Table({
  head: ['id', 'department', 'overhead', 'sales', 'profit']
});

var connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'Bamazon'
});


function displayDepartments() {
  connection.query("SELECT * FROM departments", function(err, result) {
    if (err) throw err;

    result.forEach(function(entry) {
      var row = [];
      row.push(entry.id);
      row.push(entry.Department);
      row.push(entry.Overhead);
      row.push(entry.Sales);

      table.push(row);
    })

    console.log(table.toString());

  })
}

function viewSales() {
  connection.query('SELECT *, Sales-Overhead as Profit FROM departments', function(err, result) {
    result.forEach(function(entry) {
      var row = [];
      row.push(entry.id);
      row.push(entry.Department);
      row.push(entry.Overhead);
      row.push(entry.Sales);
      row.push(entry.Profit);

      table2.push(row);
    })

    console.log(table2.toString());
  })
}

function addDepartment(department, overhead) {
  connection.query('INSERT INTO departments SET ?', {Department: department, Overhead: overhead, Sales: 0}, function() {
    console.log('\n------------------------------------------------------');
    console.log(department+' has been added to the store.');
    console.log('------------------------------------------------------\n');
    setTimeout(displayDepartments, 3000);
  })
}

addDepartment('Sporting Goods', 500);
