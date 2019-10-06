const WebSocket = require('ws');
var ws = null;

exports.ws = function () {
  return ws;
};

exports.initialize = function(server) {
  return ws = new WebSocket.Server({ server });
};
