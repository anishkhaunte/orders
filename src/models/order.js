const uuid = require('uuid')
const { Schema } = require('mongoose')

const OrderSchema = new Schema({
  _id: {
    type: String,
    default: uuid.v4
  },
  customer: {
    type: String
  },
  discountCode: String,
  description: String,
  pin: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    default: CONST.ORDER_STATUES.CREATE,
    enum: Object.values(CONST.ORDER_STATUES)
  }

}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
})

OrderSchema.pre('save', function (next) {
  this.updated_at = new Date()
  return next()
})

module.exports = OrderSchema

