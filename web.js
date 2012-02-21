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


// this array will hold card data from forms
driverArray = []; 

//main page - display the card form
app.get('/', function(request, response) {
    var templateData = { 
        pageTitle : 'Cably'
        
    };
    
    response.render("form.html", templateData);
});

app.post('/', function(request, response){
    console.log("Inside app.post('/')");
    console.log("form received and includes")
    console.log(request.body);
    
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

//display a specfic card
app.get('/driver/:driverNumber', function(request, response){

    // Get the card from cardArray
    driverData = driverArray[request.params.driverNumber] //cardData contains 'to', 'from', 'message', 'image'
    
    if (driverData != undefined) {
        
        // Render the card_display template - pass in the cardData
        response.render("display.html", driverData);
        
    } else {
        // card not found. show the 'Card not found' template
        response.render("card_not_found.html");
        
    }
    
});


// Make server turn on and listen at defined PORT (or port 3000 if is not defined)
var port = process.env.PORT || 4000;
app.listen(port, function() {
  console.log("Listening on " + port);
});