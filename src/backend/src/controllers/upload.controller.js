import { UploadService } from '../services/upload.service.js';
const { addToIPFS } = new UploadService();

class UploadController extends UploadService {
    constructor() {
        super();
    }

    uploadFile(req, res) {
        const file = req.file;
        if (!file) {
            const error = new Error('Please upload a file');
            error.httpStatusCode = 400;
            return next(error);
        }
        addToIPFS(file.buffer).then((result) => {
            res.json({ hash: result.path, url: `https://gratia.infura-ipfs.io/ipfs/${result.path}`, filetype: file.mimetype });
        })
    }
}

export default UploadController;