var scrapedarticles;

// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<p data-id='" + data[i]._id +
                          "'>" + data[i].title +
                          "<br />" + data[i].abstract +"</p>" +
                          "<a href=" + data[i].url + ">" + data[i].url + "</a>");
  }
});


$(document).on("click", ".btn-danger", function() {
  console.log("The Scrape New Articles button was clicked.");
  $(".card-container").empty();
  $.getJSON("/scrape", function(data) {

    scrapedarticles = data;
    // For each one    
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      var button = new $("<button>");
      button.attr("class", "btn btn-success d-none d-lg-inline-block mb-3 mb-md-0 ml-md-3");
      button.attr("data-id", i);
      button.text("SAVE ARTICLE");

      var buttondiv = new $("<div>");
      buttondiv.attr("class", "nav-item pull-right");
      buttondiv.append(button);

      var headertitle = new $("<div>");
      headertitle.attr("class", "nav-item pull-left");
      headertitle.text(data[i].title);

      var cardheader = new $("<div>");
      cardheader.attr("class", "card-header");
      cardheader.append(headertitle);
      cardheader.append(buttondiv);

      var cardp = new $("<p>");
      cardp.text(data[i].abstract);

      var carda = new $("<a>");
      carda.attr("href", data[i].url);
      carda.text(data[i].url);

      var cardbody = new $("<div>");
      cardbody.append(cardp);
      cardbody.append(carda);

      var card = new $("<div>");
      card.attr("class", "card");
      card.append(cardheader);
      card.append(cardbody);
      $(".card-container").append(card);
    }
    // TODO: Have a modal to tell us how many articles
    //       we got from data.length
    $("#modal-message").text("Added " + data.length + " new articles!");
    $("#scrape-modal").modal();
  });
});


$(document).on("click", ".saved-articles", function() {
  console.log("The Saved Articles button was clicked.");
  $(".card-container").empty();
  $.getJSON("/articles", function(data) {
    // For each one    
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      // TODO: Fix this to save a note instead of saving an article
      var deletebutton = new $("<button>");
      deletebutton.attr("class", "btn btn-danger d-none d-lg-inline-block mb-3 mb-md-0 ml-md-3 delete-btn");
      deletebutton.attr("data-id", data[i]._id);
      deletebutton.text("DELETE FROM SAVED");

      var notesbutton = new $("<button>");
      notesbutton.attr("class", "btn btn-success d-none d-lg-inline-block mb-3 mb-md-0 ml-md-3 note-btn");
      notesbutton.attr("style", "background-color: purple;");
      notesbutton.attr("data-id", data[i]._id);
      notesbutton.text("ARTICLE NOTES");

      var buttondiv = new $("<div>");
      buttondiv.attr("class", "nav-item pull-right");
      buttondiv.append(notesbutton);
      buttondiv.append(deletebutton);

      var headertitle = new $("<div>");
      headertitle.attr("class", "nav-item pull-left");
      headertitle.text(data[i].title);

      var cardheader = new $("<div>");
      cardheader.attr("class", "card-header");
      cardheader.append(headertitle);
      cardheader.append(buttondiv);

      var cardp = new $("<p>");
      cardp.text(data[i].abstract);

      var carda = new $("<a>");
      carda.attr("href", data[i].url);
      carda.text(data[i].url);

      var cardbody = new $("<div>");
      cardbody.append(cardp);
      cardbody.append(carda);

      var card = new $("<div>");
      card.attr("class", "card");
      card.append(cardheader);
      card.append(cardbody);
      $(".card-container").append(card);
    }
  });
});

/*
// Whenever someone clicks a p tag
$(document).on("click", "p", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .done(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note && data.note.length > 0) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note[0].title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note[0].body);
      }
    });
});
*/

/*
// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .done(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
*/