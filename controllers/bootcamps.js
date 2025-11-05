import bootcamp_model from '../models/bootcamps.js'
import { async_handler } from '../middlewares/async-handler.js'
import { error_response } from '../utils/error-response.js'
import { geocoder } from '../utils/geocode.js'

export const get_all_bootcamps = async_handler(async (req, res, next) => {
  let query

  //Copy req.query
  const req_query = {...req.query}

  //Field to exclude
  const remove_fields = ['select', 'sort', 'page', 'limit'];

  //Loop over fields and delete them from reqQuery
  remove_fields.forEach(param => delete req_query[param])


  console.log(req_query)

  //Crete query stryng
  let query_str = JSON.stringify(req_query)

  //Crat operators gt gte lt lte in
  query_str = query_str.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)

  //Finding resource
  query = bootcamp_model.find(JSON.parse(query_str)).populate('courses')

  //Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ')
    query = query.select(fields)
  }

  if (req.query.sort) {
    const sort_by = req.query.sort.split(',').join(' ')
    query = query.sort(sort_by)
  } else (
    query = query.sort ('-created_at')
  )

  //Pagination
  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit, 10) || 100
  const start_index = (page - 1) * limit
  const end_index = page * limit
  const total = await bootcamp_model.countDocuments();

  query = query.skip(start_index).limit(limit);
  
  //Executing query
  console.log(query_str)

  //Pagination result
  const pagination = {};

  if (end_index < total) {
    pagination.next = {
      page: page + 1,
      limit,

    }
  }

  if (start_index > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    }
  }

  const fetched_bootcamps = await query

  if (!fetched_bootcamps) {
    return next(
      new error_response(`Bootcamps not fetched`, 404)
    )
  }

  res.status(200).json({
    success: true,
    pagination,
    message: 'Successfully fetched bootcamps',
    data:fetched_bootcamps
  })
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
    message: `Found bootcamp ${bootcamp.name}`
  })
}

export const create_bootcamp = async (req, res, next) => {
  const new_bootcamp =  await  bootcamp_model.create(req.body)

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
      new error_response('Bootcamps not found', 200)
    )
  }

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps
  })

})