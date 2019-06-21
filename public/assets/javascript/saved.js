

$(document).ready(function() {
  const articleContainer = $(".article-container");

  $(document).on("click", ".btn-delete", articleDelete);
  $(document).on("click", ".btn-notes", articleNotes);
  $(document).on("click", ".btn-save", articleSave);
  $(document).on("click", ".btn.note-delete", noteDelete);

  initPage();

  function initPage() {
    articleContainer.empty();
    $.get("/api/headlines?saved=true").then(function(data) {
      if (data && data.length) {
        renderArticles(data);
      } else {
        renderEmpty();
      }
    });
  }

  function createPanel(article) {
    //Creates the panel element using the data from the json object
    const panel = $(
      [
        '<div class="panel panel-default">',
        '<div class="panel-heading">',
        "<h3>",
        article.headline,
        '<a class="btn button-success save">',
        "Save Article",
        "</a>",
        "</h3>",
        "</div>",
        '<div class="panel-body">',
        article.summary,
        "</div>",
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
        '<h4><a href="/">Browse Articles"</a></h4>',
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
        '<div class="container-fluid text-center">',
        "<h4>Notes for Article: ",
        currentArticle._id,
        "</h4>",
        "<hr />",
        '<ul class="list-group note-container">',
        '<textarea placeholder="New Note" rows="4" cols="60"></textarea>',
        '<button class="btn btn-success save">Save Note</button>',
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
      $('.btn.save').data('article', noteData);
      renderNotesList(noteData);
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
