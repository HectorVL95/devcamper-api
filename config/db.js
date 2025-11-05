import mongoose from 'mongoose';
import dotenv from 'dotenv'
dotenv.config()
import colors from 'colors'

export const connect_db =  async() => {
  try {
    const db = process.env.DB
    await mongoose.connect(db)
    console.log('Successfully connected to DevCamper database'.cyan)
  } catch (error) {
    console.log('Could not conenct to Devcamper database')
  }
}