/* eslint-disable no-underscore-dangle, @typescript-eslint/naming-convention */
import type { Express } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import morganBody from 'morgan-body';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function setExpressLogger(app: Express) {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const logDirectory = path.join(__dirname, '../../../.logs/queue-service');
  const logFileName = `${year}${month}${day}.log`;
  const logFilePath = path.join(logDirectory, logFileName);

  morganBody(app);

  const logFileExists = fs.existsSync(logFilePath);

  if (!logFileExists) {
    fs.mkdirSync(logDirectory, { recursive: true });
    fs.writeFileSync(logFilePath, '');
  }

  const log = fs.createWriteStream(logFilePath, {
    flags: 'a',
  });

  morganBody(app, {
    noColors: true,
    stream: log,
  });
}
