var Redis = require("ioredis");
var request = require('request');
var redis = new Redis();

redis.subscribe("orderstatus", function (err, count) {
  // `count` represents the number of channels we are currently subscribed to.
});

redis.on("message", function (channel, message) {

  console.log("Receive message %s from channel %s", message, channel);
  message = JSON.parse(message);
  
  let order = message.order;
  //TODO: confirm or decline the order depending on the status of the order
  if (order.status === 0)
    console.log("Order is declined: call the cancel API");
  else
    console.log("Order is success: call the confirm API");
  let body = {};
  request({
    uri: "http://localhost:3000/v1/orders/" + order._id+"/confirm",
    method: 'POST',
    gzip: true,
    headers: {
      'Content-Type': 'application/json'
    },
    json: body

  },
    function (error, res) {
      if (res && res.statusCode === 200 && res.body) {
        //return resolve(payload);
        console.log("Sucess is here");
      } else {
        console.log("It did not");
        //return reject({ 'customCode': 400, 'message': "DOMAINLOGINERROR", 'errors': "Bad request" })
      }
    });
  
});