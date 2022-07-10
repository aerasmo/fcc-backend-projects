const mongoose = require('mongoose');
const counter = require('./counter');

function validURL(str) {
    var pattern = new RegExp(
        /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(:[0-9]+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/
    )
    return !!pattern.test(str);
}

const linkSchema = new mongoose.Schema({
    url: { 
        type : String, 
        validate: {
            validator: validURL,
            message: "invalid url"
        }
    },
    shorturl: Number
})

linkSchema.pre('save', function(next) {
    var link = this;
    counter.findByIdAndUpdate({_id: 'entityId'}, {$inc: { seq: 1} }, {new: true, upsert: true}).then(function(count) {
        // console.log("...count: "+JSON.stringify(count));
        link.shorturl = count.seq;
        next();
    })
    .catch(e => {
        console.error("counter error-> : "+ e);
        throw e;
    });
});

linkSchema.post('save', function(doc, next) {
    console.log("Successfully saved link to the database:");
    console.log(` url: ${doc.url}`);
    console.log(` shorturl: ${doc.shorturl}`);
    next()
})

module.exports = mongoose.model('Link', linkSchema)