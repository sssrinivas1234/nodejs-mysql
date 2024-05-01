//express module used to develop the Rest API'S
var express = require("express");

//body-parser module used to read the client data
var bodyparser = require("body-parser");

//cors module used to enable the ports communication
var cors = require("cors");

var app = express();
//where "app" object used to develop the Rest API'S

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));

app.use(cors());





// Registering the users
var insert = require('./insert/insert');
app.use('/insert',insert);

var login = require('./login/login');
app.use('/login',login);





// Task module
var update = require('./update/update');
app.use('/update',update);

var remove = require('./delete/delete');
app.use('/delete',remove);

var task = require('./task/task');
app.use('/create',task);

var getTasks = require('./get/get');
app.use('/task',getTasks);

var getTasksById = require('./getbyid/getbyid');
app.use('/task',getTasksById);







app.listen(8080);
console.log("Application started successfully!");
