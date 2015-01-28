 var request = require('request'),
    cheerio = require('cheerio'),
    _ = require('lodash'),
    VerEx = require('verbal-expressions'),
    Twitter = require('twitter'),
    TwitterCredentials = require('./config.json'),
    fs = require('fs');
var client = new Twitter(TwitterCredentials);

var parentheses = VerEx().find('(').anything().then(')');
var brackets = VerEx().find('[').anything().then(']');
var abbreviations = VerEx().find('Mr.').or('Ms.').or('Mrs.').or('St.').or(' ').anything().then('.');
RANDOM_ARTICLE_ADDRESS = 'http://en.wikipedia.org/wiki/Special:Random';
for (i = 0; i < 200; i++) {
  request.get(RANDOM_ARTICLE_ADDRESS, function(err, response, body) {
    if (!err && response.statusCode === 200) {
        var $ = cheerio.load(body);
        var randomPageTitle = $('h1#firstHeading').text();
        randomPageTitle = randomPageTitle.split(' ').join('_');
        request.get(RANDOM_ARTICLE_ADDRESS, function(err, response, body) {
            if (!err && response.statusCode === 200) {
                $ = cheerio.load(body);
                var firstPara = $('p').text();
                var pageTitle = $('p b').text();
                var withoutParenth = firstPara.replace(parentheses, '');
                var purePara = withoutParenth.replace(brackets, '');
                randomPageTitle = randomPageTitle.split('_').join(' ');
                purePara = purePara.replace(pageTitle, randomPageTitle);
                
                //console.log(purePara.match(abbreviations));
                for (i = 0; i < purePara.length; i++) {
                    if (purePara[i] == '.' && purePara[i+1] == ' ') {
                        purePara = purePara.substring(0, i+1);
                        break;
                    }
                }
                var mayReferTo = purePara.indexOf("may refer to:");
                if (mayReferTo > -1) {
                    var firstSentence;
                    request.get(RANDOM_ARTICLE_ADDRESS, function(err, response, body){
                        $ = cheerio.load(body);
                        var firstPara = $('p').text();
                        for (i = 0; i < firstPara.length; i++) {
                            if (firstPara[i] == '.' && firstPara[i+1] == ' ') {
                                firstSentence = firstPara.substring(0, i+1);
                                fs.appendFile('output.txt', firstSentence + '\n', function(err){
                                    
                                });
                            }
                        }
                    });
                    purePara = purePara.concat(firstSentence);
                }
                //client.post('statuses/update', { status: purePara }, function(err, params, response){
                //}); 
                //fs.appendFile('output.txt', purePara + '\n', function(err){
                //    if (err) {
                //        console.log('Error: ' + err);
                //    }
                //});
                return console.log(purePara);
            }
        }); 
    }
});  
}

