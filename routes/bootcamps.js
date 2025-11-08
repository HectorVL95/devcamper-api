import express from 'express'
import { advanced_results } from '../middlewares/advanced-results.js'
import bootcamp_model from '../models/bootcamps.js'
import { get_all_bootcamps, get_bootcamp, update_bootcamp, delete_bootcamp, create_bootcamp, get_bootcamps_in_radius, bootcamp_photo_upload } from '../controllers/bootcamps.js'
import { protect_route, authorize } from '../middlewares/auth.js'

const bootcamp_routes = express.Router()

bootcamp_routes.get('/get_all_bootcamps', advanced_results(bootcamp_model, 'courses'), get_all_bootcamps)

bootcamp_routes.post('/create_bootcamp', protect_route, authorize('admin', 'publisher') ,create_bootcamp)

bootcamp_routes.get('/get_bootcamp/:id', get_bootcamp)

bootcamp_routes.put('/:id', protect_route, authorize('publisher'), update_bootcamp)

bootcamp_routes.delete('/delete_bootcamp/:id', protect_route, authorize('admin', 'publisher'), delete_bootcamp)

bootcamp_routes.get('/get_bootcamps_in_radius/:zipcode/:distance', get_bootcamps_in_radius)

bootcamp_routes.put('/bootcamp_photo_upload/:id', protect_route, authorize('admin', 'publisher'), bootcamp_photo_upload )

export default bootcamp_routes;