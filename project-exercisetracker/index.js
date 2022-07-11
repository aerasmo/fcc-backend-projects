const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const User = require("./models/Users")
const Users = require('./models/Users')
require('dotenv').config()

app.use(express.static('public'))

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

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// User routes
app.post('/api/users', async (req, res) => {
  let { username } = req.body;
  try {
    let user = await User.create( { username: username })
    user =  { 
      username: user.username, 
      _id:  user._id
    }
    console.log(user)
    res.json(user)
  } catch(e) {
    console.log(e.message)
    res.redirect("/")
  }
});

app.get('/api/users', async(req, res) => {
  try {
    let users = await User.find({}).select("username _id");
    res.send(users)
  } catch(e) {
    console.log(e.message);
    res.redirect("/")
  }
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
