import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import multer from 'multer';
import { create } from 'ipfs-http-client';

const projectId = '2HiowWZxAvSRnGmeoMGFWYFQao5';
const projectSecret = '4b9253006dcd401f1051942f64c1a89d';
const auth =
    'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const client = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth,
    },
});

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

app.post('/upload', upload.single('file'), async (req, res) => {
    const data = await client.add(req.file.buffer)
    res.json({ hash: data.path, url: `https://gratia.infura-ipfs.io/ipfs/${data.path}`, filetype: req.file.mimetype })
});

app.listen(4000, () => {
    console.log('Server started on port 3000');
})