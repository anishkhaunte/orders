var wss = require('./socket.js').ws();

module.exports ={
    sendMessage :function (msg, callback) {
        return wss.on("connection", function (ws) {
    
            ws.send(msg, callback);
            console.log("sent")
    
            ws.on("close", function () {
                console.log("websocket connection close")
            })
        })
    }
}