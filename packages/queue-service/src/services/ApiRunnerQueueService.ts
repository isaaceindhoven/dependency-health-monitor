import { Queue, Worker } from 'bullmq';
import { Redis } from 'ioredis';
import { defaultsDeep } from 'lodash-es';

const connection = new Redis();

export const API_RUNNER_QUEUE_NAME = 'api-runner-queue';

export type QueueDataType = {
  input: RequestInfo | URL;
  init?: RequestInit;
};

export class ApiRunnerQueueService {
  queue = new Queue<QueueDataType>(API_RUNNER_QUEUE_NAME, { connection });

  worker = new Worker<QueueDataType>(
    API_RUNNER_QUEUE_NAME,
    async (job) => {
      try {
        job.log(`Processing job for ${job.data.input}`);
        job.log(JSON.stringify(job.data));

        const init = defaultsDeep(
          {
            body: job.data.init?.body ? JSON.stringify(job.data.init?.body) : undefined,
          },
          job.data.init,
        );

        const response = await fetch(job.data.input, init);
        const responseData = await response.text();
        return {
          ...response,
          data: responseData,
        };
      } catch (error) {
        job.log(`Error ${error}`);
        throw new Error(`Error processing job for ${job.data.input}: ${error}`);
      }
    },
    {
      connection,
    },
  );
}
