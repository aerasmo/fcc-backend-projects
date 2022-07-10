const mongoose = require('mongoose');
const counter = require('./counter');
const dns = require('node:dns');
const URL = require('url').URL;

const linkSchema = new mongoose.Schema(
    {
        url: { 
            type : String, 
            validate: {
                validator: v => {
                    const urlObject = new URL(v);
                    dns.lookup(urlObject.hostname, (err, address, family) => {
                        if (err) {
                            return false
                        } else {
                            return true
                        }
                    });
                },
                message: "invalid url"
            }
        }
        ,
        shorturl: Number
    }
)
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