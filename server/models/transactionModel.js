import mongoose, { Schema } from 'mongoose'

const options = {
  timestamps: true
}

const userSchema = new Schema({
  credits: {
    type: Number,
    required: true
  },
  description: {
    type: String
  },
  transactionFrom: {
    type: String,
    required: true
  },
  transactionTo: {
    type: String,
    required: true
  }
}, options)

export default mongoose.model('Transaction', userSchema)