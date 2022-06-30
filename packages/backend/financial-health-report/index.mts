import { Octokit } from '@octokit/core';
import * as parser from 'accept-language-parser';
import { calculateEquityScore } from '@dependency-health-monitor/equity-score-calculator';
import { calculateFinancialHealthScore } from '@dependency-health-monitor/financial-health-calculator';
import type { AzureFunction, Context, HttpRequest, HttpRequestHeaders } from '@azure/functions';

const getLocaleFromHeaders = (headers: HttpRequestHeaders): string => {
  if (!headers['accept-language'] || !parser.parse(headers['accept-language'])[0]) {
    return 'en-GB';
  }

  const localeObject: parser.Language = parser.parse(headers['accept-language'])[0];
  const localeChunks = [localeObject.code, localeObject.region];

  return localeChunks.filter((str) => !!str).join('-');
};

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
  const localeString = getLocaleFromHeaders(req.headers);

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
