import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routers/index.js';

const app = express();
const port = 3259;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.listen(port, () => {
    console.log(`Server started on port http://localhost:${port}`);
})
