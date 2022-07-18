const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const User = require("./models/Users")
const Exercise = require('./models/Exercise')
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
  console.log(req.body)
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
  let _id = req.body[":_id"] || req.params._id;
  let { description, duration, date} = req.body;
  let json_response;
  if (!date) {
    date = new Date();
  }
  try {
    let user = await User.findById(_id); 
    let exercise = await Exercise.create({ description, duration, date, user: _id});

    let formattedDate = new Date(date).toDateString();
    user.log.push(exercise._id);
    user.save()

    json_response = {
      "username": user.username,
      "_id": _id,
      "description": exercise.description,
      "duration": exercise.duration,
      "date": formattedDate
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
  let { from , to, limit } = req.query;
  let json_response;
  try {
    let user = await User.findById(_id);
    let exercise, formattedDate;
    let query = {"user": _id};
    let dateQuery = {};
    if (from) {
      dateQuery["$gte"] = new Date(from);
    } 
    if (to) {
      dateQuery["$lte"] = new Date(to);
    }
    if (from || to) {
      query["date"] = dateQuery;
    }

    if (limit) {
      exercise = await Exercise.find(query, {_id: 0, description: 1, duration:1, date: 1}).limit(limit);
    } else {
      exercise = await Exercise.find(query, {_id: 0, description: 1, duration:1, date: 1});
    }
    exercise = exercise.map( obj => {
      formattedDate = obj.date.toDateString();
      let {description, duration} = obj
      return {description, duration, date: formattedDate}
    })

    json_response = {
      username: user.username,
      count: exercise.length,
      _id: user.id,
      log: exercise
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
