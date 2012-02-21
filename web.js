var express = require('express');
var ejs = require('ejs'); //embedded JS template engine
var app = express.createServer(express.logger());

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
        firstname : request.body.firstname,
        lastname : request.body.lastname,
        medallion : request.body.medallion,
        taxi : request.body.taxi
        
    };
    
    // Put this newCard object into the cardArray
    driverArray.push(newDriver);
    
    // Get the position of the card in the cardArray
    driverNumber = driverArray.length - 1;
    
    response.redirect('/driver/' + driverNumber);
});

//display a specfic driver
app.get('/driver/:driverNumber', function(request, response){   

    // Get the driver from driverData
    driverData = driverArray[request.params.driverNumber] //cardData contains 'to', 'from', 'message', 'image'
    
    if (driverData != undefined) {
        
        // Render the card_display template - pass in the cardData
        response.render("display.html", driverData);
        
    } else {
        // card not found. show the 'Card not found' template
        response.render("card_not_found.html", templateData);
        
    }
});


// Make server turn on and listen at defined PORT (or port 3000 if is not defined)
var port = process.env.PORT || 4000;
app.listen(port, function() {
  console.log("Listening on " + port);
});