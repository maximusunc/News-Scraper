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
        article += "<div class='card-action'><button class='save' data-id=" + element._id + "><i class='material-icons left'>save</i>Save Article</button></div>";
        article += "</div></div></div>";
        $(".articles").append(article);
    });
    
    save();
};

function displaySaved(data) {
    if (data.length === 0) {
        var placeholder = "<div class='row'><div class='card yellow darken-1'><div class='card-content red-text'>";
        placeholder += "<h3>You don't have any saved articles</h3>";
        placeholder += "</div></div></div>";
        $(".articles").append(placeholder);
    } else {
        $(data).each(function(i, element) {
            var article = "<div class='row'><div class='card blue-grey darken-1'><div class='card-content white-text'>";
            article += "<a href='" + element.link + "'><h2>" + element.title + "</h2></a>";
            article += "<p>" + element.description + "</p></div>";
            article += "<div class='card-action'><button class='remove' data-id=" + element._id + "><i class='material-icons left'>delete</i>Remove From Saved</button>";
            article += "<button class='note' data-id=" + element._id + "><i class='material-icons left'>add</i>Add Note</button></div>";
            article += "</div></div></div>";
            $(".articles").append(article);
        });
    };

    remove();
    note();
};

function save() {
    $(".save").on("click", function(event) {
        var id = $(this).data("id");
        $.ajax({
            method: "POST",
            url: "/saved/" + id,
        }).then(function(data) {
            console.log(data);
            $.get("/saved", function(result) {
                console.log(result);
            });
        });
    });
};

function remove() {
    $(".remove").on("click", function(event) {
        var id = $(this).data("id");
        $.ajax({
            method: "DELETE",
            url: "/remove/" + id,
        }).then(function(data) {
            console.log(data);
            $(".articles").empty();
            $.get("/savedArticles", function(data) {
                displaySaved(data);
            });
        });
    });
};

function note() {
    $(".note").on("click", function(event) {
        var id = $(this).data("id");
        $.ajax({
            method: "POST",
            url: "/note/" + id,
        }).then(function(data) {
            console.log(data);
            $(".articles").empty();
            $.get("/savedArticles", function(data) {
                displaySaved(data);
            });
        });
    });
};