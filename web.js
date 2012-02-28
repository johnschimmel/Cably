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

/*********** POST/GET CONFIGURATION *****************/

//pageTitle data passed in through layout.html
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
    console.log("This is the form submission page.");
    response.render("form.html", templateData);
});

//a user submitted driver data. It is POST'd to the server
app.post('/form/', function(request, response){
    console.log("Inside app.post('/form')");
    console.log("form received and includes:")
    console.log(request.body, templateData);
    
    //prepare the submitted driver data from the form into a data object
    var driverDataObj = {
        firstName : request.body.firstName,
        lastName : request.body.lastName,
        driverID : request.body.driverID,
        ratingNumber : request.body.ratingNumber,
        comment : request.body.comment    
    };
    
    //create a new driver record
    //Driver is a Mongoose data model and defined at the top of web.js
    //Driver can accept a data object that is defined in model.js
    var driverPost = new Driver(driverDataObj);

    //save the driver data object
    driverPost.save();
    console.log("driverDataObj is saved.")

    //redirect to show the single driver record
    response.redirect('/driver/' + driverDataObj)
});

//display a specfic driver
app.get('/driver/:driverNumber', function(request, response){   
    console.log("Inside app.get('/driver')");

    //get the driver from driverData
    Driver.findOne(/driver/)
    
    if (err) {
        console.log('error');
        console.log(err);
        response.send("this driver cannot be found!");
    }

    

        //render the display template - pass in the driverData
        response.render("display.html", driverData);
        
    } else {
        // driver not found
        response.render("driver-not-found.html", templateData);
        
    }
});
/*********** END POST/GET CONFIGURATION *****************/

// Make server turn on and listen at defined PORT (or port 3000 if is not defined)
var port = process.env.PORT || 4000;
app.listen(port, function() {
  console.log("Listening on " + port);
});