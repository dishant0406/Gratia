import { Router } from 'express'
import uploadRoutes from './upload.routes.js'

const routes = new Router();

routes.use('/upload', uploadRoutes);

export default routes;