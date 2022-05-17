function successfullMessage(msg) {
    return "✅ *ALENA*:  ```" + msg + "```"
}
function errorMessage(msg) {
    return "🛑 *ALENA*:  ```" + msg + "```"
}
function infoMessage(msg) {
    return "⏺️ *ALENA*:  ```" + msg + "```"
}


module.exports = {
    successfullMessage,
    errorMessage,
    infoMessage
}
