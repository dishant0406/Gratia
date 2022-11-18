import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routers/index.js';

const app = express();
const port = 4000;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/', routes);

app.listen(port, () => {
    console.log(`Server started on port http://localhost:${port}`);
})