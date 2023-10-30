import express from 'express';
// import rateLimit from 'express-rate-limit';
import { HealthController } from './HealthController.js';
import { ApiRunnerQueueController } from './ApiRunnerQueueController.js';

export const apiV1Router = express.Router();
// apiV1Router.use(rateLimit());
apiV1Router.use('/health', new HealthController().router);
apiV1Router.use('/api-runner', new ApiRunnerQueueController().router);
