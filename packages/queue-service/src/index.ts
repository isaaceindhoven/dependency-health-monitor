import dotenv from 'dotenv';
import { Logger } from '@dependency-health-monitor/dependency-fetcher';
import { server } from './server.js';

dotenv.config();

const logger = new Logger({ name: 'package.post.ts' });
const port = process.env.QUEUE_SERVICE_PORT || 4001;
server.listen(port, () => {
  logger.log(`Listening: http://localhost:${port}`);
});
