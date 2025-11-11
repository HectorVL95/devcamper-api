import { Router } from 'express';
import { admin_gets_users, admin_creates_user, admin_updates_user, admin_deletes_user } from '../controllers/admin_crud.js';
import { authorize } from '../middlewares/auth.js';
import { protect_route } from '../middlewares/auth.js';
import { error_response } from '../utils/error-response.js';

protect_route()
authorize('admin')

if (!authorize('admin')) {
  return new error_response('Only admins can make changes', 401)
}

const admin_crud_routes = Router()

admin_crud_routes
  .get('/admin_gets_users', admin_gets_users)

admin_crud_routes
  .post('/admin_creates_user', admin_creates_user)

admin_crud_routes
  .put('/admin_updates_user/:id', admin_updates_user)

admin_crud_routes
  .delete('/admin_deletes_user/:id', admin_deletes_user)