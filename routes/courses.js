import express from 'express'
import { get_courses, get_course, delete_course, update_course, create_course } from '../controllers/courses.js'

const courses_routes = express.Router()

courses_routes
  .get('/get_courses', get_courses)

courses_routes
  .post('/create_course/:id', create_course)

courses_routes
  .get('/get_courses/:bootcamp_id', get_courses)

courses_routes
  .get('/get_course/:id', get_course)

courses_routes
  .delete('/delete_course/:id', delete_course)

courses_routes
  .patch('/update_course/:id', update_course)

export default courses_routes;