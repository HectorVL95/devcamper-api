import { Router } from 'express';
import { register_user, login_user, get_me } from '../controllers/users.js';
import { protect_route } from '../middlewares/auth.js';

const user_routes = Router()

user_routes.post('/register_user', register_user);

user_routes.post('/login_user', login_user)

user_routes.get('/get_me', protect_route, get_me)

export default user_routes