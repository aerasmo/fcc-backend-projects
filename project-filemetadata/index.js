var express = require('express');
var cors = require('cors');
require('dotenv').config()
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.use(function middleware(req, res, next) {
  console.log(`${req.method} ${req.path} - ${req.ip}`)
  next()
})
// routes
app.get('/', function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
});

// main route
app.post('/api/fileanalyse', upload.single('upfile'), function(req, res) {
  console.log(req.file)

  let jsonResponse = {
    "name": req.file.originalname,
    "type": req.file.mimetype,
    "size": req.file.size,
  };
  console.log(jsonResponse);
  res.json(jsonResponse);
})

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
