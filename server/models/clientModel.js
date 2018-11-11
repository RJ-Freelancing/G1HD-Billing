import mongoose, { Schema } from 'mongoose'

const options = {
  timestamps: true
}

const clientSchema = new Schema({
  clientMac: {
    type: String,
    required: true,
    unique: true
  },
  parentUsername: {
    type: String,
    required: true,
  },
  accountBalance: {
    type: Number,
    default: 0
  }
}, options)

export default mongoose.model('Client', clientSchema)