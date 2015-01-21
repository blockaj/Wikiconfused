var request = require('request'),
    cheerio = require('cheerio'),
    _ = require('lodash'),
    VerEx = require('verbal-expressions'),
    Twitter = require('twitter');

var client = new Twitter({
    consumer_key: 'vCb2Cf16cyrNt13Wd76LfsXyV',
    consumer_secret: '3fGDJythkSOG29ahBXEyLN4t5Z64GTBg2grK2dpy8WzwUXWyMU',
    access_token_key: '2990681327-V9qAnFXpCiqtpaUF97IwahfMmbpfxHgvRZnq1Dm',
    access_token_secret: 'xusyFmpjZX3Y5OPkqvvIjnFUEKEovNxkkNXAID7Qi8FEI'
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
