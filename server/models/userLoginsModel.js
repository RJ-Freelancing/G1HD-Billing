import mongoose, { Schema } from 'mongoose'


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
})

export default mongoose.model('UserLogins', userLoginsSchema)