import z from 'zod';
import type { ZodError } from 'zod';
import express from 'express';
import type { Request, Response } from 'express';
import { Logger } from '@dependency-health-monitor/dependency-fetcher';
import { ApiRunnerQueueService } from '../../services/ApiRunnerQueueService.js';
import { errorHandler } from '../../middlewares.js';


export class ApiRunnerQueueController {
  router = express.Router();

  apiRunnerQueueService: ApiRunnerQueueService;

  logger = new Logger({ name: 'ApiRunnerQueueController' });

  constructor() {
    this.apiRunnerQueueService = new ApiRunnerQueueService();
    this.router.post('/', (req, res) => this.createApiRunnerJob(req, res));
  }

  createApiRunnerJob(req: Request, res: Response) {
    try {
      const createApiRunnerJobBody = z.object({
        input: z.union([z.string().url(), z.string()]),
        init: z.object({
          method: z.union([z.literal('GET'), z.literal('POST'), z.literal('PUT'), z.literal('DELETE')]),
          headers: z.record(z.string()).optional(),
          body: z.any().optional(),
        }),
      });

      this.logger.log('createApiRunnerJob', JSON.stringify(req.body, null, 2));

      const jobData = createApiRunnerJobBody.parse(req.body);
      this.apiRunnerQueueService.queue.add('api-runner-job', jobData);
      res.sendStatus(204);
    } catch (error) {
      this.logger.error('createApiRunnerJob', error);
      errorHandler(error as ZodError, req, res);
    }
  }
}
