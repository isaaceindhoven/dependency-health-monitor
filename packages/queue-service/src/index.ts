import dotenv from 'dotenv';
import { server } from './server.js';

dotenv.config();

const port = process.env.QUEUE_SERVICE_PORT || 4001;
server.listen(port, () => {
  console.log(`Listening: http://localhost:${port}`);
});
