import express from 'express';
import type { Request, Response } from 'express';

export class HealthController {
  router = express.Router();

  constructor() {
    this.router.get('/', this.getHealth);
  }

  getHealth(req: Request, res: Response) {
    res.json({
      healthy: true,
    });
  } 
}
