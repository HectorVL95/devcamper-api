import { error_response } from "../utils/error-response"

export const error_handler = (err, req, res , next) => {
  let error = { ...err }

  error.message = err.message

  console.log(err)

  if (err.name === 'CastError') {
    const message = 'Resource not found'
    error = new error_response(message, 404);
  }

  if (err.name ===  11000) {
    const message = 'Duplicate field value entered'
    error = new error_response(message, 400)
  }

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(err => err.message)
    error = new error_response(message, 400)
  }

  res.status( error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  })
}