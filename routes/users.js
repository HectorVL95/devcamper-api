import { Router } from 'express';
import { register_user, login_user, get_me, forgot_password, reset_password, update_details, logout_user } from '../controllers/users.js';
import { protect_route } from '../middlewares/auth.js';

const user_routes = Router()

user_routes.post('/register_user', register_user);

user_routes.post('/login_user', login_user)

user_routes.get('/logout_user', logout_user)

user_routes.get('/get_me', protect_route, get_me)

user_routes.post('/forgot_password', forgot_password)

user_routes.put('/reset_password/:reset_token', reset_password)

user_routes.put('/update_detail', protect_route, update_details)

export default user_routes