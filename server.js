var express = require("express");
var bodyParser =  require("body-parser");
var expressHandlebars = require("express-handlebars");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var request = require("request");

var app = express();

app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsScraper";

mongoose.connect(MONGODB_URI);

// app.get("/", function(req, res) {
//     res.send("index.html");
// });

app.get("/scrape", function(req, res) {
    console.log("test");
    request("https://www.npr.org/sections/news/", function(error, response, html) {
        var $ = cheerio.load(html);
        var results = [];
        $("div.item-info").each(function(i, element) {
            var title = $(element).find("h2").text();
            var link = $(element).find("h2").attr("href");
            var description = $(element).find("p").children().text();
            console.log(description);
            results.push({
                title: title,
                link: link,
                description: description
            });
        });
        res.send(results);
    });
})

app.listen(3000, function() {
    console.log("App running on port 3000");
});