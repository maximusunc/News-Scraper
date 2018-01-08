$(".scrape").on("click", function(event) {
    event.preventDefault();
    $.get("/scrape", function(results) {
        displayResults(results);
    });
});

function displayResults(data) {
    $(data).each(function(i, element) {
        var article = "<div class='row'><div class='card blue-grey darken-1'><div class='card-content white-text'>";
        article += "<a href='" + element.link + "'><h2>" + element.title + "</h2></a>";
        article += "<p>" + element.description + "</p></div>";
        article += "<div class='card-action'><a><i class='material-icons left'>save</i>Save Article</a></div>";
        article += "</div></div></div>";
        $(".articles").append(article);
    });
}