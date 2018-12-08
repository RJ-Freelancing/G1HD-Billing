import mongoose, { Schema } from 'mongoose'

const options = {
  timestamps: true
}

const userLoginsSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  loginIp: {
    type: String,
    required: true
  },
  loginDate: {
    type: String,
    required: true
  },
  loginUserAgent: {
    type: String,
    required: true
  }
}, options)

export default mongoose.model('UserLogins', userLoginsSchema)