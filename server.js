// Dependencies
var express    = require("express");
var handlebars = require("express-handlebars");
var mongoose   = require("mongoose");
var bodyParser = require("body-parser");
var cheerio    = require("cheerio");
var request    = require("request");

var logger     = require("morgan");
var axios      = require("axios");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({
  extended: false 
}));

// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Require all models
var db         = require("./models");
// db.on("error", function(error) {
//   console.log("Database Error: ", error);
// });

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/nytscraper", {
  useMongoClient: true
});

// Routes

// A GET route for scraping the echojs website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with request
  axios.get("https://api.nytimes.com/svc/topstories/v2/home.json?api-key=b9f91d369ff59547cd47b931d8cbc56b%3A0%3A74623931").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    console.log(response.data.results[0].title);
    var $ = response.data;

    // Save an empty result object
    var results = [];
    var result = {};

    // Add the text and href of every link, and save them as properties of the result object
    for(var i = 0; i < $.results.length; i++)
    {
      result = {
        "title": $.results[i].title,
        "url": $.results[i].url,
        "abstract": $.results[i].abstract
      };

      results.push(result);

      // Create a new Article using the `result` object built from scraping
      // TODO:  We do not actually want to save results to the  database,
      //        or console log them,  but return them to the front end
      db.Article
        .create(result)
        .then(function(dbArticle) {
          // If we were able to successfully scrape and save an Article, send a message to the client
          res.send("Scrape Complete");
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          res.json(err);
        });
    }

    console.log(Date.now());
    console.log(results);

    //  TODO:  Return the results
  });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // Grab every document in the Articles collection
  db.Article
    .find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article
    .findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// TODO:  Fix this
// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note
    .create(req.body)
    .then(function(dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// TODO:  Articles update? (id)

// TODO:  Articles delete (id)

// TODO:  Notes GET (Article id?)

// TODO:  Note POST

// TODO:  Note update (id)

// TODO:  Note delete (id)

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
