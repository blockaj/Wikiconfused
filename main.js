var request = require('request'),
    cheerio = require('cheerio'),
    _ = require('lodash'),
    VerEx = require('verbal-expressions'),
    Twitter = require('twitter'),
    colors = require('colors'),
    async = require('async');
    TwitterCredentials = require('./config.json'),
    RANDOM_ARTICLE_ADDRESS = 'http://en.wikipedia.org/wiki/Special:Random',
    sentence = '';

//TwitterCredentials should be an object stored in config.json. See README for formatting"
var client = new Twitter(TwitterCredentials);

parentheses = VerEx().find('(').anythingBut('(').then(')');
brackets = VerEx().find('[').anythingBut('[').then(']');
//abbreviations = VerEx().find('Mr').
//                        maybe('s').
//                        or('St').
//                        or('Ms').
//                        then('.');
//lists = VerEx().find('list').or('may refer to');
endOfSentence = VerEx().find('. ').range('A', 'Z');
badThings = VerEx().find('[').or(']').or(':');
console.log('Running...');
setInterval(function(){
    async.doUntil(function(callback){
        request.get(RANDOM_ARTICLE_ADDRESS, function(err, response, body) {
            if (!err && response.statusCode === 200) {
                var $ = cheerio.load(body);
                var randomPageTitle = $('h1#firstHeading').text();
                randomPageTitle = randomPageTitle.split(' ').join('_');
                request.get(RANDOM_ARTICLE_ADDRESS, function(err, response, body) {
                    if (!err && response.statusCode === 200) {
                        $ = cheerio.load(body);
                        var firstPara = $('p').first().text();
                        console.log('Article: '.bold + firstPara);
                        console.log('Article title: '.bold + randomPageTitle);
                        var pageTitle = $('p b').text();
                        var purePara = firstPara;
                        randomPageTitle = randomPageTitle.split('_').join(' ');
                        purePara = purePara.replace(pageTitle, randomPageTitle);
                        purePara = purePara.replace(parentheses, '');
                        purePara = purePara.replace(brackets, '');
                        //if (purePara.match(lists)) {
                        //    request.get(RANDOM_ARTICLE_ADDRESS, function(err, response, body) {
                        //        if (!err && response.statusCode === 200) {
                        //            var $ = cheerio.load(body);
                        //            var anotherPara = $('p').first().text();
                        //            console.log(anotherPara);
                        //            purePara = purePara.concat(anotherPara);
                        //        }
                        //    });
                        //}
                        sentence = purePara.split(endOfSentence)[0];
                        console.log("Typeof: ".bold + typeof(sentence));
                        callback();
                        
                    }
                }); 
            }
        });
        
    }, 
    function(){
        console.log('Proper sentence: ' + sentence);
        if (!sentence.match(badThings) && sentence.length < 140) {
            client.post('statuses/update', { status: purePara }, function(err, params, response){
            }); 
            return sentence;
        }
    }, function(err){
        console.log(err);
    });
}, 9000);

  



//function getSentence(bodyText, index) {
//    var returnValue;
//    if (bodyText[index] == '.' && bodyText[index + 1] == ' ') {  
//        lastThreeLetters = bodyText.substring(index-4, index+1);
//        if (!lastThreeLetters.match(abbreviations)) {
//            returnValue = bodyText.substring(0, index+1);
//        } 
//    }
//    else if (bodyText[index] == '.' && bodyText[index + 1] == '<') {
//        lastThreeLetters = bodyText.substring(index-4, index+1);
//        if (!lastThreeLetters.match(abbreviations)) {
//            returnValue = bodyText.substring(0, index+1);
//        } 
//    } 
//    else if (bodyText[index+1] == '\0') {
//        returnValue = bodyText.substring(0, index+1);
//    }
//    else if (bodyText[index+1] == '[') {
//        returnValue = bodyText.substring(0, index+1);
//    }
//    else if (bodyText.match(lists)) {
//        console.log('I have arrived.');
//        returnValue = bodyText.substring(0, index+1);
//    }
//    else {
//        index++;
//        getSentence(bodyText, index);
//    }
//    if (returnValue !== undefined) {
//        console.log('Sentence: '.red.bold + returnValue.bold);
//    }
//    return returnValue;
//}