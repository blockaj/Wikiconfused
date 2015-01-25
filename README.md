#Wikiconfused
A twitter bot that confuses wikipedia articles.

##About
Wikiconfused will take the first sentence of a randomly generated article and replace the subject
with the subject of another randomly generated article.

##Requirements
*	Node
*	Grunt

##Config
`config.json` is a file that needs to be created on before starting the bot. It stores all of your Twitter credentials and should look like this :
```javascript
{
	"consumer_key": "CONSUMER_KEY",
	"consumer_secret": "CONSUMER_SECRET",
	"access_token_key": "ACCESS_TOKEN_KEY",
	"access_token_secret": "ACCESS_TOKEN_SECRET"
}
