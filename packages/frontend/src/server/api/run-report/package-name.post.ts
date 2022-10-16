import { RunReportByPackageNameRequestModel } from '@/models/run-report/package-name';
import { parseFormDataFromRequest } from '@/helpers/parse-form-data-from-request';

export default defineEventHandler(async (event) => {
  try {
    const { fields } = await parseFormDataFromRequest(event.req);
    const parsedBody = await RunReportByPackageNameRequestModel.parseAsync(fields);
    return sendRedirect(event, `/package/${parsedBody.packageName}`);
  } catch (error) {
    if (error.statusCode) {
      return createError({ statusCode: error.statusCode, message: JSON.parse(error.message) });
    }
    return createError(error);
  }
});
