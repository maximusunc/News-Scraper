$(".scrape").on("click", function(event) {
    event.preventDefault();
    $.get("/scrape", function(error, results) {
        if (error) {
            console.log(error);
        } else {
            location.reload();
        };
    });
});

$(".addNote").on("click", function() {
    let newNote = $("#noteBody").val();
    let id = $(this).attr("id");
    $.ajax({
        method: "POST",
        url: "/note/" + id,
        data: {
            body: newNote
        }
    }).then(function(data) {
        console.log("Success");
        $("#noteBody").val("");
    });
});

function displayResults(data) {
    $(data).each(function(i, element) {
        var article = "<div class='row'><div class='card blue-grey darken-1'><div class='card-content white-text'>";
        article += "<a href='" + element.link + "'><h2>" + element.title + "</h2></a>";
        article += "<p>" + element.description + "</p></div>";
        if (element.saved === false) { 
            article += "<div class='card-action'><button class='save' data-id=" + element._id + "><i class='material-icons left'>save</i>Save Article</button></div>";
        };
        article += "</div></div></div>";
        $(".articles").append(article);
    });
    
    save();
};

function displaySaved(data) {
    if (data.length === 0) {
        var placeholder = "<div class='row'><div class='card grey lighten-1'><div class='card-content red-text'>";
        placeholder += "<h3 class='center'>You don't have any saved articles</h3>";
        placeholder += "</div></div></div>";
        $(".articles").append(placeholder);
    } else {
        $(data).each(function(i, element) {
            var article = "<div class='row'><div class='card blue-grey darken-1'><div class='card-content white-text'>";
            article += "<a href='" + element.link + "'><h2>" + element.title + "</h2></a>";
            article += "<p>" + element.description + "</p></div>";
            article += "<div class='card-action'><button class='remove' data-id=" + element._id + "><i class='material-icons left'>delete</i>Remove From Saved</button>";
            article += "<button class='note modal-trigger' data-target='notesModal' data-id=" + element._id + "><i class='material-icons left'>visibility</i>View Notes</button>";
            article += "</div></div></div></div>";
            $(".articles").append(article);
            
            // Initializes the modal
            $(".modal").modal();
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
            window.location.replace("/saved");
        });
    });
};

function remove() {
    $(".remove").on("click", function(event) {
        var id = $(this).data("id");
        $.ajax({
            method: "POST",
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
            method: "GET",
            url: "/note/" + id,
        }).then(function(data) {
            $("#modalHeader").html("<h5>Notes for Article: " + data._id + "</h5>");
            $("#notes").empty();
            data.notes.forEach(function(element) {
                $("#notes").append("<div><p>" + element.body + "<button class='deleteNote' data-id=" + element._id + " ><i class='material-icons'>delete</i></button></p></div>");
            });
            $(".addNote").attr("id", data._id);
        });
    });
};

function deleteNote() {
    $(".deleteNote").on("click", function() {
        var id = $(this).attr("data-id");
        $.ajax({
            method: "DELETE",
            url: "/note/" + id
        }).then(function(data) {
            console.log("Success");
        });
    });
};