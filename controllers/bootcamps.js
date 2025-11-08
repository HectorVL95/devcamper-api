import bootcamp_model from '../models/bootcamps.js'
import course_model from '../models/courses.js'
import { async_handler } from '../middlewares/async-handler.js'
import { error_response } from '../utils/error-response.js'
import { geocoder } from '../utils/geocode.js'
import path from 'path'

export const get_all_bootcamps = async_handler(async (req, res, next) => {
  const { bootcamp_id } = req.params

  if (req.params.bootcamp_id) {
    const courses = await course_model.find({
      bootcamp: bootcamp_id
    })

    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    })
  } else {
    res.status(200).json(res.advanced_results)
  }
})

export const get_bootcamp = async (req, res, next) => {
  const { id } = req.params;

  const bootcamp = await bootcamp_model.findById(id);

  if (!bootcamp) {
    return next(
      new error_response('Bootcamp not found', 404)
    )
  } 

  res.status(200).json({
    success: true,
    message: `Found bootcamp ${bootcamp.name}`,
    data: bootcamp
  })
}

export const create_bootcamp = async (req, res, next) => {
  const new_bootcamp =  await bootcamp_model.create(req.body)

  if (!new_bootcamp) {
    return next(
      new error_response('Bootcamp not created', 400)
    )
  }

  await new_bootcamp.save()

  res.status(201).json({
    success: true,
    message: 'Bootcamp successfully created',
    data: new_bootcamp
  })
}

export const update_bootcamp = (req, res) => {
  res.status(200).json({ success: true, message: `update bootcamp ${req.params.id}` })
}

export const delete_bootcamp = async (req, res, next) => {
  const { id } = req.params

  const deleted_bootcamp = await bootcamp_model.findById(id);

  if (!deleted_bootcamp) {
    return next(
      new error_response('Bootcamp not deleted', 400)
    )
  }

  await deleted_bootcamp.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  })
}

export const get_bootcamps_in_radius = async_handler( async (req, res, next) => {
  const { zipcode, distance } = req.params

  const loc = await geocoder.geocode(zipcode)
  const lat = loc[0].latitude
  const long = loc[0].longitude

  const radius = distance / 6378

  const bootcamps = await bootcamp_model.find({
   location: { $geoWithin: { $centerSphere: [[long, lat], radius] } }
  })

  if (!bootcamps) {
    return next (
      new error_response('Bootcamps not found', 400)
    )
  }

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps
  })

})

export const bootcamp_photo_upload = async_handler(async (req, res ,next) => {
  const { id } = req.params

  const bootcamp = await bootcamp_model.findById(id)

  if (!bootcamp) {
    return next(
      new error_response('Bootcamp not found', 400)
    )
  }

  if (!req.files) {
    return next(
      new error_response('Please upload a file', 400)
    )
  }

  const file = req.files.file

  //Make sure the image is a photo
  if (!file.mimetype.startsWith('image')) {
    return next(
      new error_response('Please upload an image file', 400)
    )
  }

  if (file.size > process.env.MAX_FILE_UPLOAD ) {
    return next(
      new error_response(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`, 400 )
    )
  }

  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      console.error(err)
      return next (
        new error_response(
          `Problem with file upload`, 500
        )
      )
    }
    await bootcamp_model.findByIdAndUpdate(id, { photo: file.name })
  })

  res.status(200).json({
    success: true,
    data: file.name
  })
  console.log(file.name)
})