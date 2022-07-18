const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema( {
    "description": String,
    "duration": Number,
    "date": {
        "type": Date,
        default: () => Date.now()
    },
    "user": {
        "type": mongoose.Schema.Types.ObjectId,
        "ref": "exercisetracker.user"
    }
})

module.exports = mongoose.model('exercisetracker.exercise', exerciseSchema)