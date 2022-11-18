import { Router } from 'express'
import UploadController from '../controllers/upload.controller.js'
import { upload } from '../services/upload.service.js'

const routes = new Router();
const { uploadFile } = new UploadController();

routes.post('/', upload.single('file'), uploadFile)

export default routes;