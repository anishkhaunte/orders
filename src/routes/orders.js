const modules = include('modules')
const express = require('express')
const router = express.Router()
const PAYMENT_CHANNEL_NAME = "payment";
const sender = require('../sender');

router.param('orderId', (req, res, next, id) =>
  new Promise((resolve, reject) => {
    req.app.models.Order
      .findOne({ _id: id }).exec()
      .then(function (order) {
        if (!order) {
          return res.notFound()
        } else {
          req.order = order;
          return next();
        }
      }).catch(function (err) {
        logError(err);
        return next(err);
      }).done();
  })
)


router.get('/', function (req, res, next) {
  let queryOpts
  const where = {}

  if (req.query.page) {
    const { page } = req.query

    queryOpts = {
      skip: (page - 1) * CONST.DEFAULT_PAGINATION_LIMIT,
      limit: CONST.DEFAULT_PAGINATION_LIMIT
    }
  } else {
    queryOpts = {};
  }

  new Promise((reject, resolve) => {
    return req.app.models.Order.find(where, {}, queryOpts).exec()
      .then(function (orders) {
        res.success({'orders':orders});
      }).catch(function (err) {
        logError(err);
        //return res.serverError()
      }).done();
  })
})



router.post('/:orderId/cancel', (req, res, next) =>
  new Promise((reject, resolve) => {
    let order = req.order;
    return modules.transition.assertBehavior("cancelOrder", order.status, CONST.ORDER_STATUES.CREATE)
      .then(() => {
        return req.app.models.Order.findOneAndUpdate({ '_id': order._id }, { $set: { 'status': CONST.ORDER_STATUES.CANCEL } }, {new:true})
      }).then(function (order) {
        res.success({ order }, HTTP_STATUS_CODES.OK);
      }).catch(function (err) {
        if (err == null) { err = Error(); }
        logError(err)
        switch (err.name) {
          case 'cancelOrder': return res.forbidden("Action not allowed");
          default: return res.serverError()
        }
      }).done();
  })
)


router.post('/:orderId/confirm', (req, res, next) =>
  new Promise((reject, resolve) => {
    let order = req.order;
    return modules.transition.assertBehavior("confirmOrder", order.status, CONST.ORDER_STATUES.CREATE)
      .then(() => {
        return req.app.models.Order.findOneAndUpdate({ '_id': order._id }, { $set: { 'status': CONST.ORDER_STATUES.CONFIRM } }, {new :true})
      }).then(function (order) {
        modules.transition.deliverOrder(order);
        //sender.sendMessage("Send message");
        res.success({ order }, HTTP_STATUS_CODES.OK);
      }).catch(function (err) {
        if (err == null) { err = Error() }
        logError(err)
        switch (err.name) {
          case 'confirmOrder': return res.forbidden("Action not allowed")
          default: return res.serverError();
        }
      }).done();
  })
)

router.post('/', (req, res, next) =>
  new Promise((reject, resolve) => {
    return modules.transition.assertBehavior("addOrder", CONST.ORDER_STATUES.CREATE, CONST.ORDER_STATUES.CREATE)
      .then(() => {
        if(!req.body.first_name)
          return Promise.reject({'name':'MissingName'});
        let pin = modules.shortener.createShortHash();

        const order = new req.app.models.Order({
          customer: req.body.first_name,
          discountCode: req.body.discountCode || undefined,
          description: req.body.description || undefined,
          pin: pin,
          status: req.body.status || CONST.ORDER_STATUES.CREATE
        });
        return order.save();
      }).then((order) => {
        let paymentObj = {
          order: order
        };

        modules.publisher.publish(PAYMENT_CHANNEL_NAME, JSON.stringify(paymentObj));
        return res.success({ order }, HTTP_STATUS_CODES.CREATED);
      }).catch(function (err) {
        if (err == null) { err = Error() }
        logError(err)
        switch (err.name) {
          case 'addOrder': return res.forbidden("Action not allowed")
          case 'MissingName': return res.badRequest()
          default: return res.serverError()
        }
      }).done();
  })
)

router.get('/:orderId', function (req, res, next) {
  let order = req.order
  return res.success({ order }, HTTP_STATUS_CODES.CREATED)
})

router.get('/:orderId/status', function (req, res, next) {
  let order = req.order;
  let status = order.status;
  return res.success({ status }, HTTP_STATUS_CODES.OK)
})

module.exports = router