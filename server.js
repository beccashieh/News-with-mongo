//Dependencies
const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

//Set our port to be either host's designation or 3000.
const PORT = process.env.PORT || 5000;

//Initiates express
const app = express();

//Sets up express router
const router = express.Router();

//Require the routes file to pass out router object
require('./config/routes')(router);


//Makes public folder a static directory
app.use(express.static('public'));
app.use(express.static('/assets/javascript'))


//Connect handlebars to our Express App
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//Use body parser in our app
app.use(bodyParser.urlencoded({
    extended: false
}));

//All requests go through the middleware
app.use(router);

//If deployed, will use deployed database. Otherwise, use the mongoHeadlines database.
const db = process.env.MONGODB_URI || 'mongodb://localhost/mongoHeadlines';

//Connect mongoose to our database
mongoose.connect(db, function(error) {
    //log any errors connecting with mongoose
    if (error) {
        console.log(error);
    }
    else {
        console.log('mongoose connection is successful');
    }
});

//Activates server to listen on the designated port.
app.listen(PORT, function() {
    console.log(`Listening on port: ${PORT}`);
});