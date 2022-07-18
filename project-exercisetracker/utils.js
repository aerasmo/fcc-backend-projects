const formatDate = (date) => {
    // => Mon Jan 01 1990
    var options = { weekday: "short", month: 'short', year: 'numeric', day: 'numeric'}
    return date.toLocaleDateString("en-US", options).replaceAll(",", "")
}

module.exports = formatDate