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
  parentUser: {
    type: String,
    required: true,
  }
}, options)

export default mongoose.model('Client', clientSchema)