module.exports = function(router) {

    //Homepage route
    router.get('/', function(req, res) {
        res.render('home');
    });

    //Saved articles page route
    router.get('/saved', function(req, res){
        res.render('saved');
    });
}