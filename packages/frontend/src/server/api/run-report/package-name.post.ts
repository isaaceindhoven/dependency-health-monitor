import * as z from 'zod';
import formidable, { IncomingForm } from 'formidable';
import { IncomingMessage } from 'http';
// import { DependencyFetcher } from '@dependency-health-monitor/dependency-fetcher';

const parseAsync = (form: InstanceType<typeof IncomingForm>, req: IncomingMessage) =>
  new Promise<{ fields: formidable.Fields; files: formidable.Files }>((resolve, reject) =>
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err);
      }
      return resolve({ fields, files });
    }),
  );

export const RunReportByPackageNameRequestModel = z.object({
  packageName: z.string(),
});

export default defineEventHandler(async (event) => {
  try {
    const form = formidable({ multiples: true });
    // const baseUrl = `https://${event.req.headers.host}`;
    const { fields } = await parseAsync(form, event.req);
    const parsedBody = await RunReportByPackageNameRequestModel.parseAsync(fields);
    // const packageFile = await DependencyFetcher.fetchPackageFile(parsedBody.packageName, 'npm');
    // const packageFileAsString = typeof packageFile === 'string' ? packageFile : JSON.stringify(packageFile);
    // const dependencyFetcher = new DependencyFetcher(packageFileAsString);
    // return dependencyFetcher.fetchOrAggregate();
    return sendRedirect(event, `/package/${parsedBody.packageName}`);
  } catch (error) {
    if (error.statusCode) {
      return createError({ statusCode: error.statusCode, message: JSON.parse(error.message) });
    }
    return createError(error);
  }
});
