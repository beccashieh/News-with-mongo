//Server Routes
//=============

//Bring in the Scrape function from the scripts folder.
const scrape = require('../scripts/scrape');

//Bring in Headlines and notes from controller folder.
const headlinesController = require('../controllers/headlines');
const notesController = require('../controllers/notes');

module.exports = function(router) {

    //Homepage route
    router.get('/', function(req, res) {
        res.render('home');
    });

    //Saved articles page route
    router.get('/saved', function(req, res){
        res.render('saved');
    });

    //Pulls the scrape function from our headlines controller file.
    router.get('/api/fetch', function(req, res) {
        headlinesController.fetch(function(err, docs) {
            if (!docs || docs.insertedCount === 0) {
                res.json({
                    message: 'No new articles today. Please check back tomorrow.'
                });
            }
            else {
                scrape();
                res.json({
                    message: `Added ${docs.insertedCount} new articles!`
                });
            }
        });
    });
    //Goes to the specific article the user wants.
    router.get('/api/headlines', function(req, res) {
        let query = {};
        if (req.query.saved) {
            query = req.query;
        }

        headlinesController.get(query, function(data) {
            res.json(data);
        });
    });

    //Allows user to remove an article.
    router.delete('/api/headlines/:id', function(req, res) {
        let query = {};
        query._id = req.params.id;
        headlinesController.delete(query, function(err, data) {
            res.json(data);
        });
    });

    //Runs the update function from the headlines controller.
    router.patch('/api/headlines', function(req, res) {
        headlinesController.update(req.body, function(err, data) {
            res.json(data);
        });
    });

    //Returns the data from the query the user sets. 
    router.get('api/notes/:headline_id?', function(req, res) {
        let query = {};
        if (req.params.headline_id) {
            query._id = req.params.headline_id;
        }

        notesController.get(query, function(err, data) {
            res.json(data);
        });
    });

    //Deletes specific note using the notes controller.
    router.delete('/api/notes/:id', function(req, res) {
        let query = {};
        query._id = req.params.id;
        notesController.delete(query, function(err, data) {
            res.json(data);
        });
    });

    //Uses notes controller save function to add the notes displaying them on front end. 
    router.post('/api/notes', function(req, res){
        notesController.save(req.body, function(data){
            res.json(data);
        });
    });
}