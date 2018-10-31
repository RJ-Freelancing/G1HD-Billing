import mongoose, { Schema } from 'mongoose'

const options = {
  timestamps: true
}

const userSchema = new Schema({
  transactionType: {
    type: String,
    required: true
  },
  transaction: {
    type: String,
    required: true
  },
  transactionTs: {
    type: Date,
    default: Date.now
  },
  originatedBy: {
    type: String,
    required: true
  }
}, options)

export default mongoose.model('Transaction', userSchema)