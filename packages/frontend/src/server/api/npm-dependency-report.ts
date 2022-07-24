import { fetchDependenciesForPackageInDepth } from '@dependency-health-monitor/npm-dependency-fetcher';

export default defineEventHandler(async (event) => {
  const body = await useBody(event);
  if (!body || (body.dependencies && !body.devDependencies)) {
    return createError({
      statusCode: 400,
      statusMessage: 'Please make sure a dependencies key or devDependencies key is present in your body.',
    });
  }
  const packageDependencies: Record<string, unknown> = { ...body.dependencies, ...body.devDependencies };
  const dependencies: Map<string, number> = await fetchDependenciesForPackageInDepth(packageDependencies);

  return Object.fromEntries(dependencies);
});
