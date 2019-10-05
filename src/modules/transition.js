

module.exports = {

  assertBehavior( behavior, currentStatus,...expectedStatuses) {
    return new Promise((resolve, reject)=>{
      if ((expectedStatuses.includes(currentStatus))) {
        return resolve({});
      }
      return reject({'name': behavior });
    });
  }
}