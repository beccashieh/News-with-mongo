
//Request and cheerio make our scrapes possible.
const axios = require('axios');
const cheerio = require('cheerio');

const scrape = function (cb) {
    axios.get('https://www.news.ycombinator.com/').then(function(body) {
        let $ = cheerio.load(body);
        console.log(body);

        let articles = [];
    
        $('.title').each(function(i, element){
            const head = $(this).children('a').text().trim();
            const sum = $(this).children('a').attr('href');
    
            //If head and sum exists, clean text.
            if (head && sum) {
                const dataToAdd = {
                    head: head,
                    sum: sum
                };
    
                //Pushes to new article array.
                articles.push(dataToAdd);
            }
        });
        //sends us the articles.
        res.send(articles);
        console.log(articles);
    });
};

module.exports = scrape;