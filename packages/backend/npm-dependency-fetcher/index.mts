import { fetchDependenciesForPackageInDepth } from '@dependency-health-monitor/npm-dependency-fetcher';
import type { AzureFunction, Context, HttpRequest } from '@azure/functions';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  if (!req.query || !req.query.packageName) {
    context.res = {
      status: 400,
      body: 'Please specify a packageName key in your query parameters.',
    };
    return;
  }
  const packageName: string = req.query.packageName;

  const dependencies: Map<string, number> = await fetchDependenciesForPackageInDepth(packageName);

  context.res = {
    body: Object.fromEntries(dependencies),
    headers: {
      'Content-Type': 'application/json',
    },
  };
};

export default httpTrigger;
