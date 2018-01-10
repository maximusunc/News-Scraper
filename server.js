var express = require("express");
var bodyParser =  require("body-parser");
var expressHandlebars = require("express-handlebars");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var request = require("request");

var app = express();
var db = require("./models");

app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsScraper";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
  useMongoClient: true
});

app.get("/saved", function(req, res) {
    db.Save.create(req.body)
        .then(function(dbSave) {
            res.json(dbSave);
        })
        .catch(function(err) {
            console.log(err);
        });
});

app.get("/scrape", function(req, res) {
    request("https://www.npr.org/sections/news/", function(error, response, html) {
        var $ = cheerio.load(html);
        
        $("div.item-info").each(function(i, element) {
            var result = {};
            result.title = $(element).find("h2").text();
            result.link = $(element).find("h2").children().attr("href");
            result.description = $(element).find("p").children().text();
            db.Article.create(result)
                .then(function(dbArticle) {
                    // console.log(dbArticle);
                    res.json(dbArticle);
                })
                .catch(function(err) {
                    console.log(err);
                });
        });
    });
});

app.get("/articles", function(req, res) {
    db.Article.find({}, function(error, found) {
        if (error) {
            console.log(error);
        } else {
            res.send(found);
        };
    });
});

app.listen(3000, function() {
    console.log("App running on port 3000");
});