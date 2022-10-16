import formidable, { Fields, Files } from 'formidable';
import { IncomingMessage } from 'http';

const form = formidable({ multiples: true });

export const parseFormDataFromRequest = (req: IncomingMessage) =>
  new Promise<{ fields: Fields; files: Files }>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err);
      }
      return resolve({ fields, files });
    });
  });
