var Redis = require("ioredis");
var request = require('request');
var redis = new Redis();

redis.subscribe("orderstatus", function (err, count) {
  // `count` represents the number of channels we are currently subscribed to.
});

redis.on("message", function (channel, message) {
  const config = include('config');
  let baseUrl;
  if (process.env.NODE_ENV !== 'production' || process.env.NODE_ENV !== 'development') {
    baseUrl = config.app.apiProtocol+"://"+config.app.hostname+":"+config.port;
  }
  console.log("Receive message %s from channel %s", message, channel);
  message = JSON.parse(message);
  var httpMethod = "";
  let order = message.order;

  if (order.status === 0)
    httpMethod = "cancel";
  else
    httpMethod = "confirm";

  request({
    uri: baseUrl+"/v1/orders/" + order._id + "/" + httpMethod,
    method: 'POST',
    gzip: true,
    headers: {
      'Content-Type': 'application/json'
    },
    json: {}

  },
    function (error, res) {
      if (res && res.statusCode === 200 && res.body) {
        //return resolve(payload);
        console.log("Order processed");
      } else {
        console.log("Order not processed");
        //return reject({ 'customCode': 400, 'message': "DOMAINLOGINERROR", 'errors': "Bad request" })
      }
    });

});