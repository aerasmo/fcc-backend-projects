const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const User = require("./models/Users")
const Exercise = require('./models/exercise')
const formatDate = require('./utils')

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

// Exercise routes
app.post('/api/users/:_id/exercises', async(req, res) => {
  let { _id } = req.params;
  let { description, duration, date} = req.body;
  let json_response;
  if (!date) {
    date = new Date();
  }
  try {
    let user = await User.findById(_id); 
    let exercise = await Exercise.create({ description, duration, date, user: _id});

    let formattedDate = formatDate(new Date(date))
    user.log.push(exercise._id);
    user.save()

    console.log(user);
    console.log(exercise);
    console.log(formattedDate)

    json_response = {
      "username": user.username,
      "description": exercise.description,
      "duration": exercise.duration,
      "date": formattedDate,
      "_id": user._id
    } 
  } catch(e) {
    console.log(e.message)
    json_response = {
      "error": e.message
    }
  }
  res.json(json_response)

})

// Logs routes
app.get('/api/users/:_id/logs', async(req, res) => {
  let { _id } = req.params;
  let json_response;
  try {
    let user = await User.findById(_id)
      .populate("log", {_id: 0, description: 1, duration:1, date: 1})
      .select("username _id log"); 
    json_response = {
      username: user.username,
      count: user.count,
      _id: user.id,
      log: user.log
    };
  } catch(e) {
    console.log(e.message);
    json_response = {
      error: e.message
    }
  }

  res.json(json_response);
})
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
