
require('./globals')
const cluster = require('cluster')
const http = require('http')
const numCPUs = require('os').cpus().length
const config = include('config')
const socketIo = require('socket.io');
const app = require('./app')
//var models = include('models');

  if (require.main === module) {
    app.listen(app.config.port, () => console.log(`Server started and listening on port ${app.config.port}`))

    // start webserver on port 8080
    var server =  http.createServer(app);

  } else {
    module.exports = {
      app,
      run () {
        return app.listen(app.config.port, () => console.log(`Server started and listening on port ${app.config.port}`))
      },
      shutdown () {
        return app.close()
      }
    }
  }


