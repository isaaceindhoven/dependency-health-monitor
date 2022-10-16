import * as z from 'zod';

export const RunReportByPackageNameRequestModel = z.object({
  packageName: z.string().min(1),
});
