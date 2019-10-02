
const path = require('path')

global.HTTP_STATUS_CODES = require('http-status-codes')

global._ = require('lodash')

global.Promise = require('bluebird');

global.moment = require('moment');

global.Redis = require("ioredis");

global.__projectdir = `${__dirname}${path.sep}`

global.__rootdir = `${process.cwd()}${path.sep}`

global.fullPath = file => `${__projectdir}${file}`

global.include = file => require(`${fullPath(file)}`)

global.allmodels = {};

global.CONST = {
  ORDER_STATUES :{
    CREATE: 'created',
    CONFIRM: 'confirmed',
    DELIVER: 'delivered',
    CANCEL: 'cancelled'
  },
  DB_RECORD: {
    ACTIVE: 1,
    INACTIVE: 2,
    UNVERIFIED: 3
  },
  ROLE: {
    ADMIN: 1, // Full access, can create user
    ACCOUNT_MANAGER: 2, // user with write access
    EMPLOYEE: 3 //Only read access
  },
  DEFAULT_PAGINATION_LIMIT: 30,
  TIMEZONE: 'Asia/Kolkata',
  REQUEST_METHOD: {
    POST: 'POST',
    GET: 'GET'
  }
}

global.logError = function (err) {
  console.error(err)
  return console.error(err.stack)
}
