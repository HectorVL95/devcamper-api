import { async_handler } from '../middlewares/async-handler'
import user_model from '../models/users.js'

export const admin_gets_users = async_handler(async (req, res, next) => {
  const users =  await user_model.findMany()

  res.status(200).json({
    success: true,
    message: 'Admin got the following user',
    data: users
  })
})

export const admin_creates_user = async_handler(async (req, res, next) => {


  const user =  await user_model.createOne(req.body)

  res.status(200).json({
    success: true,
    message: 'User created',
    data: user
  })
})

export const admin_updates_user = async_handler(async (req, res, next) => {
  const { id } = req.params

  const user = await user_model.findByIdAndUpdate(id, req.body)

  res.status(200).json({
    success: true,
    message: 'User updated',
    data: user
  })
})

export const admin_deletes_user = async_handler(async (req, res, next) => {
  const { id } = req.params

  const user = await user_model.findByIdAndDelete(id)
    res.status(200).json({
    success: true,
    message: 'User updated',
    data: user
  })
})