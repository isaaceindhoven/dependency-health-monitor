import express from 'express';
import type { Request, Response } from 'express';
// import { PackageAggregatorWorker } from '@dependency-health-monitor/dependency-fetcher';

export const packageRoutes = express.Router();

packageRoutes.get('/', (req: Request, res: Response) => {
  res.status(204);
});
