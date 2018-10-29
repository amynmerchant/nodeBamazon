var mysql = require('mysql');
var inquirer = require('inquirer');
var quantity = 0;
var totalOrder = [];

// inquirer.prompt([{
//   name: 'Name',
//   type: 'Input',
//   message: 'Please provide your name',
// }, {
//   name: 'fruit',
//   type: 'list',
//   message: 'Fruit you like?',
//   choices: ['Papaya', 'Mango', 'Lychee', 'Apple'],
//   default: 3,
// }]).then((answers) => {
//   console.log(`\nHi ${answers.name}. I like ${answers.fruits} too!\n`);
// });

var connection = mysql.createConnection({
    host: "localhost",
  
    // Connection
    port: 3306,
  
    // Username
    user: "root",
  
    // Password
    password: "UofT20oTcamp",
    database: "bamazon"
});
  
connection.connect(function(err) {
    if (err) throw err;
    console.log('connected!');
    runSearch();
});
  
function runSearch() {
    inquirer
    .prompt([{
        name: "askID",
        type: "input",
        message: "Enter productID (1-10/ 'exit')?"
    }, {
        name: "askQuantity",
        type: "input",
        message: "Enter quantity (Number)?"
    }])
    .then((answer) => {
        getQuantity(answer);
    });
}

function getQuantity(answer) {
    if(answer.askID === 'exit'){
        console.log('Thank you for shopping!');
        console.log('Amount due : ' + calculatePrice(totalOrder));
        connection.end();
        return;
    }
    var quanReq = parseInt(answer.askQuantity);
    var itemReq = parseInt(answer.askID);
    console.log(answer.askQuantity, answer.askID);
    var query = "SELECT stock_quantity, price FROM products WHERE ?";
    connection.query(query, { item_id: answer.askID }, function(err, res) {
        if(err) {
            connection.end();
            throw err;
        }
        quantity = parseInt(res[0].stock_quantity);
        price = parseFloat(res[0].price);
        if(quanReq > quantity){
            console.log('Quantity unavailable. Update quantity.');
            runSearch();
        } else {
            var newQuantity = quantity - quanReq;
            console.log('Updating.......');
            updateRows(newQuantity, itemReq);
            totalOrder.push([quanReq,price]);
            console.log('Order successful!\n');
            runSearch();
        }
    });
}

function updateRows(quantity, item) {
    var sql = `UPDATE products SET stock_quantity = ${quantity} WHERE item_id = ${item}`;
    connection.query(sql, function (err, result) {
        if(err) {
            connection.end();
            throw err;
        }
    });
}

function calculatePrice(totalOrder){
    var tp = 0.0;
    totalOrder.forEach(arr => {
        tp += (arr[0] * arr[1]);
    });
    return tp;
}