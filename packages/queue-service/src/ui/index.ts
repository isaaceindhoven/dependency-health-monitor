import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter.js';
import { ApiRunnerQueueService } from '../services/ApiRunnerQueueService.js';

const apiRunnerQueueService = new ApiRunnerQueueService();
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/ui');

createBullBoard({
  queues: [new BullMQAdapter(apiRunnerQueueService.queue)],
  serverAdapter,
});

export const uiRouter = serverAdapter.getRouter();
