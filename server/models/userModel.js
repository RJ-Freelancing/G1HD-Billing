import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcryptjs'

const options = {
  timestamps: true
}

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  email: {
    type: String,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  phoneNo: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    required: true
  },
  accountStatus: {
    type: Boolean,
    required: true,
    default: false
  },
  upgradedAccount: {
    type: Boolean,
    required: true,
    default: false
  },
  parentUsername: {
    type: String,
    required: true
  },
  childUsernames: [
    {
      type: String
    }
  ],
  creditsAvailable: {
    type: Number,
    default: 0
  },
  creditsOwed: {
    type: Number,
    default: 0
  }
}, options)

userSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.password;
  return obj;
 }

userSchema.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

userSchema.methods.isValidPassword = async function (loginPassword) {
  try {
    return await bcrypt.compare(loginPassword, this.password)
  } catch (error) {
    throw new Error(error)
  }
}

export default mongoose.model('User', userSchema)