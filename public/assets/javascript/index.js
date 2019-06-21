$(document).ready(function() {
    const articleContainer = $(".article-container");
    $(document).on("click", ".btn.save", articleSave);
    $(document).on("click", "scrape-new", articleScrape);
  
    initPage();
  
    function initPage() {
      //Empty the container and run AJAX request for unsaved headlines.
      articleContainer.empty();
      $.get("/api/headlines?saved=false").then(function(data) {
        //if there are headlines, they will render on the page for us.
        if (data && data.length) {
          renderArticles(data);
        } else {
          renderEmpty();
        }
      });
    }
  
    function renderArticles(articles) {
      //Appends article data to the page.
      //Array holds all available articles from our database.
      let articlePanels = [];
      //Each article passes to the create function to create our article panels.
      for (let i = 0; i < articles.length; i++) {
        articlePanels.push(createPanel(articles[i]));
      }
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
  
    function renderEmpty() {
      const emptyMessage = $(
        [
          '<div class="alert alert-warning text-center">',
          "<h4> There are no new articles</h4>",
          "</div>",
          '<div class="panel panel-default">',
          '<div class="panel-heading text-center">',
          "<h3>What would you like to do?</h3>",
          "</div>",
          '<div class="panel-body text-center">',
          '<h4><a class="scrape-new">Scrape New Articles</a></h4>',
          '<h4><a href="/saved">Go to my Saved Articles"</a></h4>',
          "</div>",
          "</div>"
        ].join("")
      );
      //Appends this data to the alert
      articleContainer.append(emptyMessage);
    }
  
    function articleSave() {
      //Allows user to save a selected article.
      const articleToSave = $(this)
        .parents(".panel")
        .data();
      //We retrieve the initially assigned onject containing heardline.
      //We access it here.
      articleToSave.saved = true;
  
      //using patch as it is updating existing collection.
      $.ajax({
        method: "PATCH",
        url: "/api/headlines",
        data: articleToSave
      }).then(function(data) {
      //if successfil, object key will be equal to 1 and cast to true.
        if (data.ok) {
          //reloads the page. 
          initPage();
        }
      });
    }
  
    function articleScrape() {
      //handles when user hits scrape new articles button.
      $.get("/api/fetch")
      .then(function(data) {
      //Compares NYTimes and compares the articles with what we already have.
      //Lets user know how many unique articles were found. 
        initPage();
        bootbox.alert('<h3 class="text-center m-top-80">'+ data.message + '</h3>')
      });
    }
  });
  