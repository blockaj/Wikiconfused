var request = require('request'),
    cheerio = require('cheerio'),
    _ = require('lodash'),
    VerEx = require('verbal-expressions'),
    Twitter = require('twitter'),
    colors = require('colors');
    TwitterCredentials = require('./config.json'),
    RANDOM_ARTICLE_ADDRESS = 'http://en.wikipedia.org/wiki/Special:Random';

//TwitterCredentials should be an object stored in config.json. See README for formatting"
var client = new Twitter(TwitterCredentials);

parentheses = VerEx().find('(').anything().then(')');
brackets = VerEx().find('[').anything().then(']');
abbreviations = VerEx().find('Mr').
                        maybe('s').
                        or('St').
                        or('Ms').
                        then('.');
lists = VerEx().find('list').or('may refer to');
console.log(parentheses._source, brackets._source, abbreviations._source);
    console.log('Running...');
    request.get(RANDOM_ARTICLE_ADDRESS, function(err, response, body) {
        if (!err && response.statusCode === 200) {
            var $ = cheerio.load(body);
            var randomPageTitle = $('h1#firstHeading').text();
            randomPageTitle = randomPageTitle.split(' ').join('_');
            request.get(RANDOM_ARTICLE_ADDRESS, function(err, response, body) {
                if (!err && response.statusCode === 200) {
                    $ = cheerio.load(body);
                    var firstPara = $('p').first().text();
                    console.log(firstPara);
                    var pageTitle = $('p b').text();
                    var purePara = firstPara;
                    randomPageTitle = randomPageTitle.split('_').join(' ');
                    purePara = purePara.replace(pageTitle, randomPageTitle);
                    purePara = purePara.replace(parentheses, '');
                    purePara = purePara.replace(brackets, '');
                    if (purePara.match(lists)) {
                        request.get(RANDOM_ARTICLE_ADDRESS, function(err, response, body) {
                            if (!err && response.statusCode === 200) {
                                var $ = cheerio.load(body);
                                var anotherPara = $('p').first().text();
                                console.log(anotherPara);
                                purePara = purePara.concat(anotherPara);
                            }
                        });
                    }
                    purePara = getSentence(purePara, 0);
                    //client.post('statuses/update', { status: purePara }, function(err, params, response){
                    //}); 
                    //fs.appendFile('output.txt', purePara + '\n', function(err){
                    //    if (err) {
                    //        console.log('Error: ' + err);
                    //    }
                    //});
                }
            }); 
        }
    });  



function getSentence(bodyText, index) {
    var returnValue;
    if (bodyText[index] == '.' && bodyText[index + 1] == ' ' || bodyText[index+1] == VerEx().endOfLine()) {  
        lastThreeLetters = bodyText.substring(index-4, index+1);
        if (!lastThreeLetters.match(abbreviations)) {
            returnValue = bodyText.substring(0, index+1);
        } 
    } else {
        index++;
        getSentence(bodyText, index);
    }
    if (returnValue !== undefined)
        console.log('Sentence: '.red.bold + returnValue.bold);
    return returnValue;
}