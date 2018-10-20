import mongoose, { Schema } from 'mongoose'

const options = {
  timestamps: true
}

const clientSchema = new Schema({
  macAddress: {
    type: String,
    required: true,
    unique: true
  },
  creditsAvailable: {
    type: Number,
    default:0
  },
  parentID: {
    type: String,
    required: true
  }
}, options)



export default mongoose.model('client', clientSchema)