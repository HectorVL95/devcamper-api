import { error_response } from '../utils/error-response.js';
import { async_handler } from '../middlewares/async-handler.js';
import user_model from '../models/users.js';
import { send_token_response } from '../utils/send-token-response.js';
import { send_email } from '../utils/send-email.js';
import crypto from 'crypto'

export const register_user = async_handler(async (req, res) => {
  const { name, email, password, role } = req.body

  const new_user = await user_model.create({
    name, email, password, role
  })

  send_token_response(new_user, 200, res);
})

export const login_user = async_handler(async(req, res, next) => {
  const { email, password } = req.body

  const user = await user_model.findOne({ email }).select('+password')

  if (!user) {
    return next(
      new error_response('User does not exist', 400)
    )
  }

  const login = await user.match_password(password)

  if (!login) {
    return next(
      new error_response('wrong credentials', 401)
    )
  }

  send_token_response(user, 200, res);
})

export const logout_user = async_handler(async(req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10),
    httpOnly: true,
  })

  res.status(200).json({
    success: true,
    data: {}
  })
})

export const get_me = async_handler( async (req, res, next) => {
  const { id } = req.user
  
  const user = await user_model.findById(id)

  res.status(200).json({
    success: true,
    message: 'Logged user fetched',
    data: user
  })
})

export const forgot_password = async_handler( async (req, res, next) => {
  
  const user = await user_model.findOne({email: req.body.email})

  if (!user) {
    return next(
      new error_response('There is no user with that email', 404)
    )
  }

  const reset_token = user.get_reset_password_token()

  await user.save({ validateBeforeSave: false })

  const reset_url = `${req.protocol}://${req.get('host')}/api/v1/reset_pasword/${reset_token}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. please make a PUT request to : \n\n ${reset_url}`

  try {
    await send_email({
      email: user.email,
      subject: 'Password reset token',
      message,

    })

    res.status(200).json({
      success: true,
      data: 'Email sent'
    })
  } catch (error) {
    console.log(error)
    user.reset_password_token = undefined,
    user.reset_password_expired = undefined

    await user.save({validateBeforeSave: true})
    return next( new error_response('email could not be sent', 500))
  }

  console.log(reset_token)
 
  res.status(200).json({
    success: true,
    message: 'Logged user fetched',
    data: user
  })
})

export const reset_password = async_handler( async (req, res, next) => {
  const { id } = req.user
  
  const reset_password_token = crypto.createHash('hash256').update(req.params.reset_token).digest('hex')
  
  const user = await user_model.findOne({
    reset_password_token,
    reset_password_expired: {$gt: Date.now()}
  })

  if (!user) {
    return next(new error_response('Invalid token', 400))
  }

  user.password = req.body.password
  user.reset_password_token = undefined
  user.reset_password_expired = undefined
  await user.save();

  send_token_response(user, 200, res)
})

export const update_details = async_handler( async (req, res, next) => {
  const { id } = req.user
  
  const user = await user_model.findById(id)

  await user.updateOne(req.body)

  res.status(200).json({
    success: true,
    message: 'Logged user fetched',
    data: user
  })
})

export const update_password = async_handler( async (req, res, next) => {
  const { id } = req.user
  
  const user = await user_model.findById(id).select('+password')

  if (!(await user.match_password(req.body.current_password))) {
    return next(new error_response('Password is incorrect', 401))
  }

  user.password = req.body.password

  res.status(200).json({
    success: true,
    message: 'Logged user fetched',
    data: user
  })
})
