import course_model from '../models/courses.js';
import bootcamp_model from '../models/bootcamps.js'
import { error_response } from '../utils/error-response.js';

export const get_courses = async (req, res, next) => {
  let query

  if (req.params.bootcamp_id) {
    query = course_model.find({ bootcamp: req.params.bootcamp_id })
  } else {
    query = course_model.find().populate('bootcamp', 'name')
  }

  const courses = await query

  if (!courses) {
    return next( 
      error_response('Courses not found', 404)
    )
  }

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses
  })
}

export const get_course = async (req, res, next) => {
  const { id } = req.params

  const course = await course_model.findById(id).populate('bootcamp', 'name description')

  if (!course) {
    return next(
      error_response('No course found', 404)
    )
  }

  res.status(200).json({
    success: true,
    data: course
  })
}

export const create_course =  async (req, res, next) => {
  const { id } = req.params

  const bootcamp = await bootcamp_model.findById(id)

  if (!bootcamp) {
    return next(
      error_response('Bootcam non existen', 404)
    )
  }

  const course = await course_model.create({...req.body, bootcamp: id})

  res.status(200).json({
    success: true,
    message: `Created course ${course.title} for bootcamp ${bootcamp.name}`
  })
}


export const delete_course = async (req, res, next) => {
  const { id } = req.params

  const course = await course_model.findById(id)

  if (!course) {
    return next(
      error_response('No course found', 404)
    )
  }

  const bootcamp = await bootcamp_model.findById(course.bootcamp)

  if (!bootcamp) {
    return next (
      error_response('No bootcamp exist', 404)
    )
  }

  await course.deleteOne()

  res.status(200).json({
    success: true,
    message: `course ${course.title} deleted`
  })
}

export const update_course = async (req, res, next) => {
  const { id } = req.params

  const course = await course_model.findById(id)

  if (!course) {
    return next(
      error_response('Course not found', 404)
    )
  }

  await course.updateOne(req.body)

  res.status(200).json({
    success: true,
    messagE: `Course ${course.title} updated its info`
  })
}