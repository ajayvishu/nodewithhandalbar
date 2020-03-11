//use path module
const path = require('path');
//use express module
const express = require('express');
//use hbs view engine
const hbs = require('hbs');
//use bodyParser middleware
const bodyParser = require('body-parser');
//use sql database
const sql = require("mssql");

const app = express();

// Config for your database
var config = {
    user: 'sa',
    password: '123456',
    server: 'localhost', 
    database: 'TESTDB' 
};

//connect to database

sql.connect(config,function(err,res_suc){
	if(err) throw err;
    console.log('sql connected...');
});

//Function to connect to database and execute query
var  executeQuery = function(res, query){             
    sql.connect(config, function (error_db) {
        if (error_db) {   
            console.log("Error while connecting Database :- " + error_db);
            res.send(error_db);
        }
        else 
		{
            var request = new sql.Request();
            request.query(query, function (error_query, res_data) {
                if (error_query) {
                    console.log("Error while querying Database :- " + error_query);
                    res.send(error_query);
                }
                else {
                    console.table(res_data.recordset);
					res.render('employee_view',{
					  results: res_data.recordset
					});
                }
            });
        }
    });           
}

//set views file
app.set('views',path.join(__dirname,'views'));
//set view engine
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//set folder public as static folder for static file
app.use('/assets',express.static(__dirname + '/roots'));

//route for homepage
app.get('/',(req, res) => {
  var sql = "SELECT convert(varchar(50),EmployeeJoiningDate,25) as EmployeeJoiningDate,EmployeeID,Employeename,Status FROM Employee";
  executeQuery (res, sql);
});

//insert employee record
app.post('/save',(req, res) => {
  var query = "INSERT INTO Employee VALUES ('" + req.body.employee_name + "','" + req.body.employee_joiningdate + "','" + req.body.status + "')";
  sql.connect(config, function (error_db) {
        if (error_db) {   
            console.log("Error while connecting Database :- " + error_db);
            res.send(error_db);
        }
        else 
		{
            var request = new sql.Request();
            request.query(query, function (error_query, res_data) {
                if (error_query) {
                    console.log("Error while querying Database :- " + error_query);
                    res.send(error_query);
                }
                else {
                    console.table(res_data.recordset);
					res.redirect('/');
                }
            });
        }
    });
});

//update employee record
app.post('/update',(req, res) => {
  var query = "UPDATE Employee SET Employeename= '" + req.body.employee_name  +  "' , EmployeeJoiningDate=  '" + req.body.employee_joiningdate + "',Status=  '" + req.body.status + "'  WHERE EmployeeID= " + req.body.employee_id;
  sql.connect(config, function (error_db) {
        if (error_db) {   
            console.log("Error while connecting Database :- " + error_db);
            res.send(error_db);
        }
        else 
		{
            var request = new sql.Request();
            request.query(query, function (error_query, res_data) {
                if (error_query) {
                    console.log("Error while querying Database :- " + error_query);
                    res.send(error_query);
                }
                else {
                    console.table(res_data.recordset);
					res.redirect('/');
                }
            });
        }
    });
});

//delete employee record
app.post('/delete',(req, res) => {
  var query = "DELETE FROM Employee WHERE EmployeeID=" + req.body.id;
  sql.connect(config, function (error_db) {
        if (error_db) {   
            console.log("Error while connecting Database :- " + error_db);
            res.send(error_db);
        }
        else 
		{
            var request = new sql.Request();
            request.query(query, function (error_query, res_data) {
                if (error_query) {
                    console.log("Error while querying Database :- " + error_query);
                    res.send(error_query);
                }
                else {
                    console.table(res_data.recordset);
					res.redirect('/');
                }
            });
        }
    });
});

app.listen(5555, () => {
  console.log('Server is running at port 5555');
});
