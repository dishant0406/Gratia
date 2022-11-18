// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import nextConnect from 'next-connect';
import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(),
});

const uploadMiddleware = upload.single('file');

const apiRoute = nextConnect({
  // Handle any other HTTP method
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(uploadMiddleware);

// Process a POST request
apiRoute.post((req, res) => {
  console.log(req.file);
  res.status(200).json({ data: 'success' });
});

export default apiRoute;
