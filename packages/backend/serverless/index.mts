import { fetchDependenciesForPackageInDepth } from '@dependency-health-monitor/npm-dependency-fetcher';
import type { AzureFunction, Context, HttpRequest } from '@azure/functions';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  if (!req.body || !req.body.packageName) {
    context.res = {
      status: 401,
      body: 'Please specify a packageName key in your body.',
    };
    return;
  }
  const packageName: string = req.body.packageName || '';

  const dependencies: Map<string, number> = await fetchDependenciesForPackageInDepth(packageName);

  context.res = {
    body: Object.fromEntries(dependencies),
  };
};

export default httpTrigger;
