## california-landscape-bot

### .env

This should exist with valid Twitter API keys:

```
CONSUMER_KEY
CONSUMER_SECRET=
ACCESS_TOKEN=
ACCESS_TOKEN_SECRET=
```

### CLI usage

`node california-landscape-bot.js` - tweet a random still image
`node california-landscape-bot.js --gif` - tweet a random GIF
`node california-landscape-bot.js --site=Axis-Vollmer` - tweet a still image from a particular site
`node california-landscape-bot.js --gif --duration=6h --mode=all` - tweet a GIF with a specific duration (15m, 1h, 3h, 6h, 12h) and mode ("all" or "smooth")
