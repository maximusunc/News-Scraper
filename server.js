var express = require("express");
var bodyParser =  require("body-parser");
var expressHandlebars = require("express-handlebars");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var request = require("request");
var path = require("path");

var app = express();
var db = require("./models");

app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(express.static("public"));
app.set('view engine', 'html');

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsScraper";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
  useMongoClient: true
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

app.post("/saved/:id", function(req, res) {
    db.Article.findOne({_id: req.params.id}, function(error, found) {
        if (error) {
            console.log(error);
        } else {
            db.Save.create({
                title: found.title,
                link: found.link,
                description: found.description
            })
            .then(function(dbSave) {
                res.json(dbSave);
            })
            .catch(function(err) {
                console.log(err);
            });
        }
    })
});

app.get("/saved", function(req, res) {
    res.sendFile(path.join(__dirname, "public/saved.html"));
});

app.get("/savedArticles", function(req, res) {
    db.Save.find({}, function(error, found) {
        if (error) {
            console.log(error);
        } else {
            res.send(found);
        };
    });
});

app.delete("/remove/:id", function(req, res) {
    db.Save.remove({_id: req.params.id}, function(error, result) {
        if (error) {
            console.log(error);
        } else {
            res.send(result);
        };
    });
});

app.post("/addNote/:id", function(req, res) {
    db.Save.update({_id: req.params.id}, {$push: {note: req.body.note}})
    .then(function(dbNote) {
        console.log(dbNote);
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
                    console.log(dbArticle);
                })
                .catch(function(err) {
                    console.log("test");
                });
        });
    });
});

app.listen(3000, function() {
    console.log("App running on port 3000");
});