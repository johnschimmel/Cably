This project is a demo for the Dynamic Web Development class at ITP/NYU

It demonstrates using ExpressJS framework with NodeJS for a multi-page website. The web app uses EJS as a template language. 

- Template files are in the /views folder.
- Static files are in the /static folder

Routes 

GET  / renders the /views/card_form.html

POST / renders the saves card data to a javascript array for later retrieval. Redirects to /card/:cardNumber

GET /card/:cardNumber pulls a specific card from the cardData array and renders the /views/card_display.html.

The files were created from the Heroku tutorial, "Getting Started with Node.js on Heroku/Cedar" http://devcenter.heroku.com/articles/node-js

