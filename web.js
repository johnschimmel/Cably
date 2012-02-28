var express = require('express');
var ejs = require('ejs'); //embedded JS template engine

var app = express.createServer(express.logger());

var mongoose = require('mongoose'); //include mongoose

var schema = mongoose.Schema //MongoDB library

/************ DATABASE CONFIGURATION **********/
//console.log('console.log: server config fired');
//console.log(mongoose);
//console.log(process.env.MONGOLAB_URI)
app.db = mongoose.connect(process.env.MONGOLAB_URI); //connect to MongoLabs database - local server uses .env file

//include the database model / schema
require('./models').configureSchema(schema, mongoose);

//define your DB Model variables
var Driver = mongoose.model('Driver');
/************* END DATABASE CONFIGURATION *********/

/*********** SERVER CONFIGURATION *****************/
app.configure(function() {
    
    /*********************************************************************************
        Configure the template engine
        We will use EJS (Embedded JavaScript) https://github.com/visionmedia/ejs
        
        Using templates keeps your logic and code separate from your HTML.
        We will render the html templates as needed by passing in the necessary data.
    *********************************************************************************/

    app.set('view engine','ejs');  // use the EJS node module
    app.set('views',__dirname+ '/views'); // use /views as template directory
    app.set('view options',{layout:true}); // use /views/layout.html to manage your main header/footer wrapping template
    app.register('html',require('ejs')); //use .html files in /views

    /******************************************************************
        The /static folder will hold all css, js and image assets.
        These files are static meaning they will not be used by
        NodeJS directly. 
        
        In your html template you will reference these assets
        as yourdomain.heroku.com/img/cats.gif or yourdomain.heroku.com/js/script.js
    ******************************************************************/
    app.use(express.static(__dirname + '/static'));
    
    //parse any http form post
    app.use(express.bodyParser());
    
    /**** Turn on some debugging tools ****/
    app.use(express.logger());
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

});
/*********** END SERVER CONFIGURATION *****************/

/*********** PAGES LAYOUT *****************/

//h1 passed in through layout.html
var templateData = {
        pageTitle : "Cably",
    }

// this array will hold driver data from forms
driverArray = []; 

//your about page
app.get('/', function(request, response) {
    response.render("cably-home.html", templateData);
});

//display the driver form
app.get('/form/', function(request, response) {
    console.log("this is the form submission page");
    response.render("form.html", templateData);
});

app.post('/form/', function(request, response){
    console.log("Inside app.post('/')");
    console.log("form received and includes")
    console.log(request.body, templateData);
    
    // Simple data object to hold the form data
    var newDriver = {
        firstName : request.body.firstName,
        lastName : request.body.lastName,
        driverID : request.body.driverID,
        ratingNumber : request.body.ratingNumber,
        comment : request.body.comment
        
    };
    
    // Put this newDriver object into the driverArray
    driverArray.push(newDriver);
    
    // Get the position of the driver in the driverArray
    driverNumber = driverArray.length - 1;
    
    response.redirect('/driver/' + driverNumber);
});

//display a specfic driver
app.get('/driver/:driverNumber', function(request, response){   

    // Get the driver from driverData
    driverData = driverArray[request.params.driverNumber] 
    
    if (driverData != undefined) {
        
        // Render the display template - pass in the driverData
        response.render("display.html", driverData);
        
    } else {
        // driver not found
        response.render("driver-not-found.html", templateData);
        
    }
});
/*********** END PAGES LAYOUT *****************/

// Make server turn on and listen at defined PORT (or port 3000 if is not defined)
var port = process.env.PORT || 4000;
app.listen(port, function() {
  console.log("Listening on " + port);
});