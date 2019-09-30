const modules = include('modules')
const express = require('express')
const router = express.Router()
const PAYMENT_CHANNEL_NAME = "payment";

router.param('orderId', (req, res, next, id) =>
  new Promise((resolve, reject) => {
    req.app.models.Order
      .findOne({ _id: id }).exec()
      .then(function (order) {
        if (!order) {
          return res.notFound()
        } else {
          req.order = order
          return next()
        }
      }).catch(function (err) {
        logError(err)
        return next(err)
      }).done()
  })
)

/*
@api {POST} /management/requests/list fetch list of all pending requests
@apiName List
@apiGroup Management

@apiSuccess {Boolean} status true
@apiSuccess {Object} data
*/
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
    queryOpts = {}
  }

  new Promise((reject, resolve) => {
    return req.app.models.Order.find(where, {}, queryOpts).exec()
      .then(function (orders) {
        res.success(orders);
      }).catch(function (err) {
        logError(err)
        console.log(err)
        //return res.serverError()
      }).done()
  })
})


/*
@api {POST} /orders/request_access Provides a normal user to request for write access
@apiName Request
@apiGroup Management

@apiParam {String} [user_id]

@apiSuccess {Boolean} status true
@apiSuccess {Object} data
*/
router.post('/:orderId/cancel', (req, res, next) =>
  new Promise((reject, resolve) => {
    console.log("Inside the cancel API");
    //TODO: DO the entire thing
    let order = req.order;
    return req.app.models.Order.update({ '_id': order._id }, { $set: { 'status': 'cancelled' } }, {})
      .then(function (order) {
        res.success({ order }, HTTP_STATUS_CODES.OK);
      }).catch(function (err) {
        logError(err);
      }).done();
  })
)


router.post('/:orderId/confirm', (req, res, next) =>
  new Promise((reject, resolve) => {
    console.log("Inside the confirm API");
    //TODO: DO the entire thing
    let order = req.order;
    return req.app.models.Order.update({ '_id': order._id }, { $set: { 'status': 'confirmed' } }, {})
      .then(function (order) {
        res.success({ order }, HTTP_STATUS_CODES.OK);
      }).catch(function (err) {
        logError(err);
      }).done();
  })
)
/*
@api {POST} /orders/ Provides a normal user to request for write access
@apiName Approve
@apiGroup Management

@apiParam {String} [user_id]

@apiSuccess {Boolean} status true
@apiSuccess {Object} data
*/
router.post('/', (req, res, next) =>
  new Promise((reject, resolve) => {
    //TODO: Check the customer name validation and the status value(creation)
    //TODO: better catch block handling by refrring to other examples
    //TODO : rejecting the promise (state machine)

    let pin = modules.shortener.createShortHash();

    const order = new req.app.models.Order({
      customer: req.body.first_name,
      discountCode: req.body.discountCode || undefined,
      description: req.body.description || undefined,
      pin: pin,
      status: req.body.status
    })
    return order.save().then((order) => {
      //TODO: publish the message that order created
      let paymentObj = {
        order: order
      };

      modules.publisher.publish(PAYMENT_CHANNEL_NAME, JSON.stringify(paymentObj));
      //return res.success();
      return res.success({ order }, HTTP_STATUS_CODES.CREATED);
    }).catch(function (err) {
    
      logError(err)
    }).done()
  })
)

router.get('/:orderId', function (req, res, next) {
  let order = req.order
  return res.success({ order }, HTTP_STATUS_CODES.CREATED)
})

module.exports = router