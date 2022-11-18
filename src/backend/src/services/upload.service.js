import IPFSClient from '../libs/ipfs.client.js';
import multer from 'multer';

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

class UploadService {
    async addToIPFS(data) {
        const result = await IPFSClient.add(data);
        return result;
    }
}

export { upload, UploadService }