const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        "type": String,
    },
    log: [{
        "type": mongoose.Schema.Types.ObjectId,
        "ref": "exercisetracker.exercise"
    }]
})

userSchema.virtual("count").get(function() {
	return this.log.length;
})

module.exports = mongoose.model('exercisetracker.user', userSchema)