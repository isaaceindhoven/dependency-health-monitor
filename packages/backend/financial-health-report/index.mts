import { Octokit } from '@octokit/core';
import * as parser from 'accept-language-parser';
import { calculateEquityScore } from '@dependency-health-monitor/equity-score-calculator';
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

  let localeString = 'en-GB';

  if (req.headers['accept-language']) {
    const localeObject: parser.Language = parser.parse(req.headers['accept-language'])[0];
    localeString = localeObject.code + localeObject.region || '';
  }

  const financialHealthReport = await calculateFinancialHealthScore(packageName, localeString);
  const equityReport = await calculateEquityScore(packageName, financialHealthReport.finalScore);
  const rateLimitLeft = await octokit.request('GET /rate_limit', {});

  context.res = {
    body: {
      financialHealthReport,
      equityReport,
      rateLimitLeft: {
        remaining: rateLimitLeft.data.resources.core.remaining,
        reset: rateLimitLeft.data.resources.core.reset * 1000,
      },
    },
    headers: {
      'Content-Type': 'application/json',
    },
  };
};

export default httpTrigger;
