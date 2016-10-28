var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');

var table = new Table({
  head: ['id', 'department', 'overhead', 'sales']
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

displayDepartments();
