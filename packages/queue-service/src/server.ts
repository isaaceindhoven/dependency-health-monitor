import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import cors from 'cors';

import { apiV1Router } from './api/v1/index.js';
import { uiRouter } from './ui/index.js';
import { setExpressLogger } from './logging.js';

const app = express();
app.disable('x-powered-by');

app.use(helmet());
app.use(express.json());
app.use(hpp());
app.use(cors());

setExpressLogger(app);

app.use('/ui', uiRouter);
app.use('/api/v1', apiV1Router);

export const server = app;
