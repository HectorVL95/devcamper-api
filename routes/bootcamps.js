import express from 'express'
import { get_all_bootcamps, get_bootcamp, update_bootcamp, delete_bootcamp, create_bootcamp, get_bootcamps_in_radius } from '../controllers/bootcamps.js'

const bootcamp_routes = express.Router()

bootcamp_routes.get('/get_all_bootcamps', get_all_bootcamps)

bootcamp_routes.post('/create_bootcamp', create_bootcamp)

bootcamp_routes.get('/get_bootcamp/:id', get_bootcamp)

bootcamp_routes.put('/:id', update_bootcamp)

bootcamp_routes.delete('/delete_bootcamp/:id', delete_bootcamp)

bootcamp_routes.get('/get_bootcamps_in_radius/:zipcode/:distance', get_bootcamps_in_radius)

export default bootcamp_routes;