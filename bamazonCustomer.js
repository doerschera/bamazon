var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');

var table = new Table({
  head: ['id', 'product', 'department', 'price', 'quantity'],
  colWidths: [100, 200, 200, 100, 100]
})
