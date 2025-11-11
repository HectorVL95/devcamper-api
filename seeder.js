import fs from 'fs'
import mongoose from 'mongoose'
import colors from 'colors'
import dotenv from 'dotenv'
dotenv.config()
import bootcamp_model from './models/bootcamps.js'
import course_model from './models/courses.js'
import user_model from './models/users.js'
import review_model from './models/reviews.js'

const connect = async () => {
  try {
    await mongoose.connect(process.env.DB)
    console.log('Connected to db')
  } catch (error) {
    console.error('not connected', error)
  }
}

const bootcamps = JSON.parse(
  fs.readFileSync(`./data/bootcamps.json`, `utf-8`)
)

const courses = JSON.parse(
  fs.readFileSync(`./data/courses.json`, `utf-8`)
)

const users = JSON.parse(
  fs.readFileSync(`./data/users.json`, 'utf-8')
)

const reviews = JSON.parse(
  fs.readFileSync(`./data/reviews.json`, 'utf-8')
)


const import_data = async () => {
  try {
    await bootcamp_model.create(bootcamps)
    await course_model.create(courses)
    await user_model.create(users)
    await review_model.create(reviews)
    console.log('Data imported...'.green.inverse)
    process.exit()
  } catch (error) {
    console.error(error)
  }
}

const delete_data = async () => {
  try {
    await bootcamp_model.deleteMany()
    await course_model.deleteMany()
    await user_model.deleteMany()
    await review_model.deleteMany()
    console.log('Data deleted...'.red.inverse)
    process.exit()
  } catch (error) {
    console.error(error)
  }
}

if (process.argv[2] === '-i') {
  connect()
  import_data()
} else if (process.argv[2] === '-d') {
  connect()
  delete_data()
}
