import dotenv from 'dotenv'
dotenv.config();

export const send_token_response = (user, status_code, res) => {
  const token = user.get_signed_jwt_token();

  const options = {
    expiresIn: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  }

  if (process.env.NODE_ENV === 'production') {
    options.secure = true
  }

  res
    .status(status_code) 
    .cookie('token', token, options)
    .json({
      success: true,
      token
    })
}