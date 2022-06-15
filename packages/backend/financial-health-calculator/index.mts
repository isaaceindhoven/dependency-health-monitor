import { Octokit } from '@octokit/core';
import { calculateFinancialHealthScore } from '@dependency-health-monitor/financial-health-calculator';
import type { AzureFunction, Context, HttpRequest } from '@azure/functions';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  if (!req.body || !req.body.packageName) {
    context.res = {
      status: 400,
      body: 'Please specify a packageName key in your body.',
    };
    return;
  }

  const octokit = new Octokit();
  const rateLimitLeftBefore = await octokit.request('GET /rate_limit', {});

  if (rateLimitLeftBefore.data.resources.core.remaining === 0) {
    context.res = {
      status: 400,
      body: `API rate limit reached. Reset is on ${new Date(rateLimitLeftBefore.data.resources.core.reset * 1000)}`,
    };
    return;
  }

  const packageName = req.body.packageName;
  const financialHealthReport = await calculateFinancialHealthScore(packageName);
  const rateLimitLeft = await octokit.request('GET /rate_limit', {});

  context.res = {
    body: {
      financialHealthReport,
      rateLimitLeft: {
        remaining: rateLimitLeft.data.resources.core.remaining,
        reset: rateLimitLeft.data.resources.core.reset,
      },
    },
    headers: {
      'Content-Type': 'application/json',
    },
  };
};

export default httpTrigger;
