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
});

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
                        if (withoutParenth[i] == '.' && withoutParenth[i+1] == ' ') {
                            console.log(typeof(withoutParenth));
                            withoutParenth = withoutParenth.substring(0, i+1);
                            break;
                        }
                    }
                    var mayReferTo = withoutParenth.indexOf("may refer to:");
                    var firstSentence;
                    if (mayReferTo > -1) {
                        request.get('http://en.wikipedia.org/Special:Random', function(err, response, body){
                            $ = cheerio.load(body);
                            var firstPara = $('p').text();
                            for (i = 0; i < firstPara.length; i++) {
                                if (firstPara[i] == '.' && firstPara[i+1] == ' ') {
                                    firstSentence = firstPara.substring(0, i+1);
                                }
                            }
                        });
                        withoutParenth = withoutParenth.concat(firstSentence);
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
  var returnValue = false;
  var length = title.length;
  var wikiless = removeWikiCharacters(text);
  console.log(text);
  return returnValue = wikiless.indexOf(title);
};
