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
        console.log("Found object:")
        console.log(link)
    } catch (e) {
        console.log(e.message)
        return 
    }
    return link
}

  module.exports = {saveURLToDB, findLinkByShortURL }