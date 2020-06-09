const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

app.set('views', `${__dirname}/views`);
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, 'public')));
app.use (bodyParser.urlencoded( {extended : true} ) );
app.use ('/', require('./app/routes'));

app.listen(80, () => {
    console.log("Server started");
});