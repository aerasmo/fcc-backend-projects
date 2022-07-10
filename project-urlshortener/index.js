require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
let bodyParser = require('body-parser')
const app = express();
const commands = require('./commands')

// Basic Configuration
let port = process.env.PORT

app.use(cors());
app.use('/public', express.static(`${process.cwd()}/public`));

app.use(bodyParser.urlencoded({extended: false}))  

app.use(function middleware(req, res, next) {
  console.log(`${req.method} ${req.path} - ${req.ip}`)
  next()
})

// Database 
mongoose.connect(
  process.env.MONGO_URI,  
  { useNewUrlParser: true, useUnifiedTopology: true }
)

// Routes
app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.get('/api/shorturl', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/shorturl', async function(req, res) {
  // res.json({ greeting: 'hello API' });
  let { url } = req.body 
  let data 
  try {
    let link = await commands.saveURLToDB(url)
    data = {
      "original_url": link.url,
      "short_url": link.shorturl
    }
  } catch(e) {
    data = {
      "error": e
    }
  }
  res.json(data)
});

app.get('/api/shorturl/:shorturl', async function(req, res) {
  let { shorturl } = req.params;
  let link = await commands.findLinkByShortURL(shorturl);
  res.redirect(link.url);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
