var express = require('express');
var app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");

// задаем EJS как механизм просмотра для нашего приложения Express
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));

app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "views")));
app.use(methodOverride("_method"));

// use res.render to load up an ejs view file

// index page
app.get('/', function(req, res) {
    res.render('pages/index');
});

app.listen(8080);
console.log('Listen on port 8080');