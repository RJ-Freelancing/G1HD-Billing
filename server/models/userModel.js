import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcryptjs'


const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  }
})

userSchema.pre('save', async function(next){
  try {
    const salt = await bcrypt.genSalt(10)  
    this.password = await bcrypt.hash(this.password, salt)   
    next()
  } catch (error) {
    next(error)
  }
})

userSchema.methods.isValidPassword = async function(loginPassword){
  try {
    return await bcrypt.compare(loginPassword, this.password)
  } catch (error) {
    throw new Error(error)
  }
}


export default mongoose.model('user', userSchema)