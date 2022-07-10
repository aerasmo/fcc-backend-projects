// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


app.get("/api", (req, res) => {
  date = new Date()
  data = {
      "unix": date.getTime(),
      "utc": date.toUTCString()
  }
  res.json(data)
})
app.get("/api/:date", (req, res) => {
  let { date } = req.params

  if (! (isNaN(date))) {
      date = new Date(parseInt(date))
  } else {
      date = new Date(date)
  }
  data = {
      "unix": date.getTime(),
      "utc": date.toUTCString()
  }
  if (Object.prototype.toString.call(date) === '[object Date]') {
      if (isNaN(date)) {
          res.status(500).json({ error : "Invalid Date" })            
      } else {
          res.json(data)
      }
  } else {
    res.status(500).json({ error : "Invalid Date" })            
  }

})


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
