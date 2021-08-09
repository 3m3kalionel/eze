import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import routes from './routes';
import connect, { getDb } from './connect';

dotenv.config();

export const port = process.env.PORT || 8080;

const app = express();

connect();
getDb();

app.use(bodyParser.json({ limit: '1000mb' }));
app.use(
  bodyParser.urlencoded({
    limit: '1000mb',
    extended: true,
    parameterLimit: 1000000,
  })
);

routes(app);

app.get('/', (req, res) => res.status(200).send('Yo! Welcome 2 eze wholesale'));

export default app;
