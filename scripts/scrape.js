
//Request and cheerio make our scrapes possible.
const axios = require('axios');
const cheerio = require('cheerio');

const scrape = function (cb) {
    axios('https://www.nytimes.com').then(function(response) {
        let $ = cheerio.load(response.data);

        let articles = [];
    
        $('.theme-summary').each(function(i, element){
            const head = $(element).children('.story-heading').text().trim();
            const sum = $(element).children('.summary').text().trim();
    
            if(head && sum){
                const headNeat = head.replace(/(\r\n|\n|\r|\t|\s+)/gm, "").trim();
                const sumNeat = sum.replace(/(\r\n|\n|\r|\t|\s+)/gm, "").trim();
    
                const dataToAdd = {
                    headline: headNeat,
                    summary: sumNeat
                };
    
                articles.push(dataToAdd);
            }
        });
        cb(articles);
        console.log(articles);
    });
};

module.exports = scrape;