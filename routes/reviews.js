import { Router } from 'express'
import { get_reviews, get_single_review, create_review_for_bootcamp, update_review, delete_review } from '../controllers/reviews.js'
import review_model from '../models/reviews.js'
import { advanced_results  } from '../middlewares/advanced-results.js'
import { authorize, protect_route } from '../middlewares/auth.js'

const review_routes = Router()

review_routes
  .get('/get_reviews/:bootcamp_id', get_reviews
  )
  .get('/get_single_review/:id', get_single_review)
  .post(authorize('user admin'), '/create_review_for_bootcamp/:bootcamp_id', protect_route ,authorize('user admin'), create_review_for_bootcamp)
  .put('/update_review', protect_route, authorize('user admin'), update_review)
  .delete('/delete_review', protect_route, authorize('user admin'), delete_review )


export default review_routes