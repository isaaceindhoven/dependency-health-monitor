import { fetchDependenciesForPackageInDepth } from '@dependency-health-monitor/npm-dependency-fetcher';
import type { AzureFunction, Context, HttpRequest } from '@azure/functions';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  if (!req.body || (!req.body.dependencies && !req.body.devDependencies)) {
    context.res = {
      status: 400,
      body: 'Please make sure a dependencies key or devDependencies key is present in your body.',
    };
    return;
  }
  const packageDependencies: Record<string, unknown> = { ...req.body.dependencies, ...req.body.devDependencies };

  const dependencies: Map<string, number> = await fetchDependenciesForPackageInDepth(packageDependencies);

  context.res = {
    status: 200,
    body: Object.fromEntries(dependencies),
  };
};

export default httpTrigger;
