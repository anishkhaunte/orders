

module.exports = {

  assertBehavior( behavior, currentStatus,...expectedStatuses) {
    return new Promise((resolve, reject)=>{
      if ((expectedStatuses.includes(currentStatus))) {
        return resolve({});
      }
      return reject({'name': behavior });
    });
  },

  deliverOrder (order){
    this.initateDelivery(order);
    setTimeout(() => {
       this.initateDelivery(order);     
    }, 4000);
  },

  initateDelivery(order){
    let models = include('models');
    new Promise((reject, resolve)=>{
      return models.Order.findOneAndUpdate({ '_id': order._id }, { $set: { 'status': CONST.ORDER_STATUES.DELIVER } },{new:true}).then((order)=>Promise.resolve());
    });
  }
}