var request = require('request'),
    cheerio = require('cheerio'),
    _ = require('lodash'),
    VerEx = require('verbal-expressions'),
    Twitter = require('twitter'),
    TwitterCredentials = require('./config.json'),
    RANDOM_ARTICLE_ADDRESS = 'http://en.wikipedia.org/wiki/Special:Random';

//TwitterCredentials should be an object stored in config.json. See README for formatting"
var client = new Twitter(TwitterCredentials);

parentheses = VerEx().find('(').anything().then(')');
setInterval(function(){
    console.log('Running...');
    request.get('http://en.wikipedia.org/wiki/Special:Random', function(err, response, body) {
        if (!err && response.statusCode === 200) {
            var $ = cheerio.load(body);
            var randomPageTitle = $('h1#firstHeading').text();
            randomPageTitle = randomPageTitle.split(' ').join('_');
            console.log(randomPageTitle);
            request.get('http://en.wikipedia.org/wiki/Special:Random', function(err, response, body) {
                if (!err && response.statusCode === 200) {
                    $ = cheerio.load(body);
                    var firstPara = $('p').text();
                    var pageTitle = $('p b').text();
                    var withoutParenth = firstPara.replace(parentheses, '');
                    randomPageTitle = randomPageTitle.split('_').join(' ');
                    withoutParenth = withoutParenth.replace(pageTitle, randomPageTitle);
                    for (i = 0; i < withoutParenth.length; i++) {
                        if (withoutParenth[i] == '.') {
                            console.log(typeof(withoutParenth));
                            withoutParenth = withoutParenth.substring(0, i+1);
                            break;
                        }
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
}, 90000);