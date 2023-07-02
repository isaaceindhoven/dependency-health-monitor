import { DependencyFetcher } from '@dependency-health-monitor/dependency-fetcher';

export default defineEventHandler(async (event) => {
  try {
    const body = await useBody(event);
    const bodyAsString = typeof body === 'string' ? body : JSON.stringify(body);
    const dependencyFetcher = new DependencyFetcher(bodyAsString);
    const result = await dependencyFetcher.fetchOrAggregate();
    return result;
  } catch (error) {
    if (error.statusCode) {
      return createError({ statusCode: error.statusCode, message: error.message });
    }

    return createError(error);
  }
});
