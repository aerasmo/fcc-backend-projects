const mongoose = require('mongoose');
const counter = require('./counter');

function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
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