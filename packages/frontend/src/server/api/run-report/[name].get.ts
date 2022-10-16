import * as z from 'zod';
import { DependencyFetcher } from '@dependency-health-monitor/dependency-fetcher';

export const RunReportByPackageNameRequestModel = z.object({
  packageName: z.string(),
});

export default defineEventHandler(async (event) => {
  try {
    const packageFile = await DependencyFetcher.fetchPackageFile(event.context.params.name, 'npm');
    const packageFileAsString = typeof packageFile === 'string' ? packageFile : JSON.stringify(packageFile);
    const dependencyFetcher = new DependencyFetcher(packageFileAsString);
    const fetcherResult = await dependencyFetcher.fetchOrAggregate();

    return Object.values(fetcherResult.packages)
      .map((p) => ({
        name: p.name,
        quantity: p.dependents.length,
      }))
      .sort((a, b) => b.quantity - a.quantity);
  } catch (error) {
    if (error.statusCode) {
      return createError({ statusCode: error.statusCode, message: JSON.parse(error.message) });
    }
    return createError(error);
  }
});
