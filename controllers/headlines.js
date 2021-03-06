const scrape = require('../scripts/scrape');
const makeDate = require('../scripts/date');

//Bring in the Headline and Note mongoose models
const Headline = require('../models/Headline');

module.exports = {
    //runs scrape function and inserts them into db.
    fetch: function(cb) {
        scrape(function(data) {
            const articles = data;
            for (let i = 0; i < articles.length; i++) {
                articles[i].date = makeDate();
                articles[i].saved = false;
            }

            //Inserts the articles into the headlines function
            Headline.collection.insertMany(articles, {ordered:false}, function(err, docs){
                cb(err, docs);
            });
        });
    },
    delete: function(query, cb) {
        Headline.remove(query, cb);
    },
    get: function(query, cb) {
        Headline.find(query)
        .sort({
            _id: -1
        })
        .exec(function(err, doc) {
            cb(doc);
        });
    },
    update: function(query, cb) {
        Headline.update({_id: query._id}, {
            $set: query
        }, {}, cb);
    }
}