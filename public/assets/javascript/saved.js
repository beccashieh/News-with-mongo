

$(document).ready(function() {
  const articleContainer = $(".article-container");

  $(document).on("click", ".btn-delete", articleDelete);
  $(document).on("click", ".notes", articleNotes);
  $(document).on("click", ".btn-save", noteSave);
  $(document).on("click", ".note-delete", noteDelete);

  initPage();

  function initPage() {
    articleContainer.empty();
    //Looking for articles that match the query with the saved=true to show only saved articles.
    $.get("/api/headlines?saved=true").then(function(data) {
      if (data && data.length) {
        renderArticles(data);
      } else {
        renderEmpty();
      }
    });
  }

  function renderArticles(articles) {
    //Handles sending the HTML with the article data to the page.
    //JSON containing all of the available articles in our database goes here.
    let articlePanels = [];
    //We pass each article object to the createPanel function
    for (let i = 0; i < articles.length; i++) {
      articlePanels.push(createPanel(articles[i]));
    }
    //Now we can append the articles in our array to the container.
    articleContainer.append(articlePanels);
  }

  function createPanel(article) {
    //Creates the panel element using the data from the json object
    const panel = $(
      [
        '<div class="panel panel-default">',
        '<div class="panel-heading">',
        "<h3>",
        article.headline,
        "</h3>",
        "</div>",
        '<div class="panel-body">',
        article.summary,
        "</div>",
        '<button class="btn button-success notes">',
        "Add Note",
        "</button>",
        '<button class="btn button-success delete">',
        "Delete Article",
        "</button>",
        "</div>"
      ].join("")
    );
    //Adds the id for article reference.
    panel.data("_id", article._id);
    //Returns the newly constructed element
    return panel;
  }

  function notesList(data) {
    let notesToRender = [];
    let currentNote;
    if (!data.notes.length) {
        currentNote = [
            //creates a list item with the notes and a delete button for each one.
            '<li class="list-group-item">',
            "There are no notes yet for this article.",
            '</li>'
        ].join("");
        notesToRender.push(currentNote);
    }
    else {
        for (let i = 0; i < data.notes.length; i++) {
            currentNote = $([
                '<li class=:list-group-item note">',
                data.notes[i].noteText,
                '<button class="btn btn-danger note-delete">Delete</button>',
                '</li>'
            ].join(""));
            currentNote.children('button').data('_id', data.notes[i]._id);
            notesToRender.push(currentNote);
        }
    }
    //appends notes inside the modal
    $('.note-container').append(notesToRender);
  }

  function renderEmpty() {
    const emptyMessage = $(
      [
        '<div class="alert alert-warning text-center">',
        "<h4> There are no saved articles</h4>",
        "</div>",
        '<div class="panel panel-default">',
        '<div class="panel-heading text-center">',
        "<h3>Do you want to Browse the available articles?</h3>",
        "</div>",
        '<div class="panel-body text-center">',
        '<h4><a href="/">Browse Articles</a></h4>',
        "</div>",
        "</div>"
      ].join("")
    );
    //Appends this data to the alert
    articleContainer.append(emptyMessage);
  }

  function articleDelete() {
    const articleToDelete = $(this)
      .parents(".panel")
      .data();
    $.ajax({
      method: "DELETE",
      url: "/api/headlines/" + articleToDelete._id
    }).then(function(data) {
      if (data.ok) {
        initPage();
      }
    });
  }

  function articleNotes() {
    const currentArticle = $(this)
      .parents(".panel")
      .data();
    $.get("/api/notes/" + currentArticle._id).then(function(data) {
      const modalText = [
        '<div class="modal" tabindex="-1" role="dialog">',
        '<div class="modal-dialog" role="document">',
        '<div class="modal-content">', 
        '<div class="modal-header">',
        '<h5 class="modal-title">Notes for Article: "',
        currentArticle._id,
        '</h5>',
        '<button type="button" class="close" data-dismiss="modal" aria-label="Close">',
        '<span aria-hidden="true">&times;</span>',
        '</button>',
        '</div>',
        '<div class="modal-body note-container">',
        "<hr />",
        '<ul class="list-group note-container">',
        '<textarea placeholder="New Note" rows="4" cols="60"></textarea>',
        '</div>',
        '<div class="modal-footer">',
        '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>',
        '<button type="button" class="btn btn-primary">Save changes</button>',
        '</div>',
        '</div>',
        '</div>',
        '</div>'
      ].join("");
      //Adds the above formatted html to the modal
      bootbox.dialog({
          message: modalText,
          closeButton: true
      });
      const noteData = {
          _id: currentArticle._id,
          notes: data || []
      };
      $('.save').data('article', noteData);
      notesList(noteData);
    });
  }

  function noteSave() {
      //Saves user's new note for an article
      let noteData;
      const newNote = $('.bootbox-body textarea').val().trim();
      //posts data to the /api/notes/ route and sends the formatted html
      if (newNote) {
          noteData = {
            _id: $(this).data('article')._id,
            noteText: newNote
          };
          $.post('/api/notes', noteData).then(function() {
              //Closes modal when complete.
              bootbox.hideAll();
          });
      }
  }

  function noteDelete() {
      //handles deletion of notes
      //Grabs the id of the note we want to get rid of
      const noteToDelete = $(this).data('_id');

      $.ajax({
          //Sends a delete request using the id as a parameter.
          url: '/api/notes/' + noteToDelete,
          method: 'DELETE'
      }).then(function() {
        //hides modal when finished.
        bootbox.hideAll();
      });
  }
});
