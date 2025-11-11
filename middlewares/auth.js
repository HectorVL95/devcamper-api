import jwt from 'jsonwebtoken'
import { async_handler } from './async-handler.js'
import { error_response } from '../utils/error-response.js'
import user_model from '../models/users.js'

export const protect_route = async_handler(async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }
  
  // else if (req.cookies.token) {
  //   token = req.cookies.token 
  // }

  if (!token) {
    return next(new error_response('Not authorized to access this route', 401))
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    console.log(decoded)

    req.user = await user_model.findById(decoded.id)
    
    next()
  } catch (error) {
    console.log('protected rpite error', error.message)
  }
})

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new error_response(`User role ${req.user.role} is not authorized to access this route`, 403)
      )
    }

    next()
  }
}