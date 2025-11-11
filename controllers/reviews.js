import review_model from '../models/reviews.js'
import { error_response } from '../utils/error-response.js'
import { async_handler } from '../middlewares/async-handler.js'
import bootcamp_model from '../models/bootcamps.js'

export const get_reviews = async_handler(async (req, res, next) => {
  if (req.params.bootcamp_id) {
    const reviews = await review_model.find({ bootcamp: req.params.bootcamp_id })

    res.status(200).json({
      success: true,
      message: 'Bootcamp reviews',
      data: reviews
    })
  } else {
    res.status(200).json(res.advanced_results)
  }
})

export const get_single_review = async_handler(async (req, res, next) => {
  const { id } = req.params

  const review = await review_model.findById(id).populate('bootcamp', 'name description')

  if (!review) {
    return next (
      error_response('Review not found', 404)
    )
  }

  res.status(200).json({
    success: true,
    message: 'Review found',
    data: review 
  })
})

export const create_review_for_bootcamp = async_handler(async(req, res, next) => {
  const { bootcamp_id } = req.params

  const bootcamp = await bootcamp_model.findById(bootcamp_id)

  if (!bootcamp) {
    return next(
      error_response('Bootcamp non existen', 404)
    )
  }

  const review = await review_model.create(req.body)
  
  res.status(200).json({
    success: true,
    message: 'Review created successfully',
    data: review
  })
})

export const update_review = async_handler(async(req, res, next) => {
  const { id } = req.params
  const { title, text, rating } = req.body
  const user = req.user._id


  const review = await review_model.findById(id);

  if (!review) {
    return next(
      error_response('Review not found', 404)
    )
  }


  if (user !==  review.user.toString()) {
    return next(
      error_response('This user is not the one who wrote the review', 400)
    )
  }

  const updated_review = await review.updateOne({
    title,
    text,
    rating
  })

  res.status(200).json({
    success: false,
    message: 'Updated review',
    data: updated_review
  })
})


export const delete_review = async_handler(async(req, res, next) => {
  const { id } = req.params
  const user = req.user._id

  const review = await review_model.findById(id)

  if (!review) {
    return next(
      error_response('Review not found', 404)
    )
  }

  
  if (user !==  review.user.toString()) {
    return next(
      error_response('This user is not the one who wrote the review', 400)
    )
  }

  await review.remove()

  res.statu(200).json({
    success: false,
    message: 'Deleted review',
    data: {}
  })

})

