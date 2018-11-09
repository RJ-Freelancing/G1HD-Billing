import mongoose, { Schema } from 'mongoose'

const options = {
  timestamps: true
}

const configSchema = new Schema({
  configName: {
    type: String,
    required: true,
    unique: true
  },
  configValue: {
    type: String,
    required: true
  }
}, options)

export default mongoose.model('Config', configSchema)