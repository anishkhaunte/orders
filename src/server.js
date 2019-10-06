
require('./globals')
const http = require('http')
const config = include('config')
const socketIo = require('socket.io');
const app = require('./app');

// start webserver on port 8080
var server = http.createServer(app);
var wss = require('./socket.js').initialize(server);
server.listen(8080, function () {
  console.log('Listening on http://localhost:8080');
});

if (require.main === module) {
  app.listen(app.config.port, () => console.log(`Server started and listening on port ${app.config.port}`))
  
} else {
  module.exports = {
    app,
    run() {
      return app.listen(app.config.port, () => console.log(`Server started and listening on port ${app.config.port}`))
    },
    shutdown() {
      return app.close()
    }
  }
}


