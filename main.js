var request = require('request'),
    cheerio = require('cheerio'),
    _ = require('lodash'),
    VerEx = require('verbal-expressions'),
    Twitter = require('twitter');

var client = new Twitter({
    consumer_key: 'CONSUMER_KEY',
    consumer_secret: 'CONSUMER_SECRET',
    access_token_key: 'ACCESS_TOKEN_KEY',
    access_token_secret: 'ACCESS_TOKEN_SECRET'
})

parentheses = VerEx().find('(').anything().then(')');
setTimeout(function(){
    request.get('http://en.wikipedia.org/wiki/Special:Random', function(err, response, body) {
        var $, randomPageTitle;
        if (!err && response.statusCode === 200) {
            $ = cheerio.load(body);
            randomPageTitle = $('h1#firstHeading').text();
            randomPageTitle = randomPageTitle.split(' ').join('_');
            console.log(randomPageTitle);
            return request.get('http://en.wikipedia.org/wiki/Special:Random', function(err, response, body) {
                var firstPara, pageTitle, withoutParenth;
                if (!err && response.statusCode === 200) {
                    $ = cheerio.load(body);
                    firstPara = $('p').text();
                    pageTitle = $('p b').text();
                    withoutParenth = firstPara.replace(parentheses, '');
                    randomPageTitle = randomPageTitle.split('_').join(' ');
                    withoutParenth = withoutParenth.replace(pageTitle, randomPageTitle);
                    for (i = 0; i < withoutParenth.length; i++) {
                        if (withoutParenth[i] == '.') {
                            console.log(typeof(withoutParenth));
                            withoutParenth = withoutParenth.substring(0, i+1);
                            break;
                        }
                    }
                    client.post('statuses/update', { status: withoutParenth }, function(err, params, response){

                    });
                    return console.log(withoutParenth);
                }
            });
        }
    });
}, 900000);


wordComparison = function(title, text) {
  var length, returnValue, wikiless;
  returnValue = false;
  length = title.length;
  wikiless = removeWikiCharacters(text);
  console.log(text);
  return returnValue = wikiless.indexOf(title);
};
