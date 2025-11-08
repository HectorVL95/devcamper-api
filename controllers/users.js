import { error_response } from '../utils/error-response.js';
import { async_handler } from '../middlewares/async-handler.js';
import user_model from '../models/users.js';
import { send_token_response } from '../utils/send-token-response.js';

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

export const get_me = async_handler( async (req, res, next) => {
  const { id } = req.user
  
  const user = await user_model.findById(id)

  res.status(200).json({
    success: true,
    message: 'Logged user fetched',
    data: user
  })
})