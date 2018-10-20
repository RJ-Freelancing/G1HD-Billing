import mongoose, { Schema } from 'mongoose'
import User from './userModel'

const options = {
  timestamps: true
}

const exampleSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  accountIDs: [
    { type: String }
  ],
  groupIDs: [
    { type: String }
  ],
  userID: {
    type: String,
    required: true
  }
}, options)



export default mongoose.model('example', exampleSchema)