import bcrypt from 'bcryptjs';
import { Schema, model } from 'mongoose';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config()

const user_model = new Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [ /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email' ]
  },
  role: {
    type: String,
    enum: ['user', 'publisher'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlenght: 6,
    select: false
  },
  reset_password_token: String,
  reset_password_expired: Date,
  created_at:{
    type: Date,
    defualt: Date.now()
  }
})


user_model.pre('save', async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt)

  next()
})

user_model.methods.get_signed_jwt_token = function () {
  return jwt.sign({id: this._id}, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE })
}

user_model.methods.match_password = async function (entered_password) {
  return await bcrypt.compare(entered_password, this.password)
}

export default model('User', user_model)