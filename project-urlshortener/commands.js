const Link = require("./Link")

async function saveURLToDB(url) {
    var link
    try {
        link = await Link.create({ url: url})
    } catch (e) {
        console.log(e.message);
        throw("invalid url");
    }
    return link
}
  
async function findLinkByShortURL(shorturl) {
    var link
    try {
        link = await Link.findOne({"shorturl": shorturl})
    } catch (e) {
        console.log(e.message)
        return 
    }
    if (link === null) {
        throw("invalid shorturl");
    }
    return link
}

module.exports = {saveURLToDB, findLinkByShortURL }