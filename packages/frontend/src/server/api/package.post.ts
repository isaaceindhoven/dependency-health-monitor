import { z } from 'zod';
import pMap from 'p-map';
import {
  DependencyFetcher,
  PackageManagerNames,
  PackageManagerNamesModel,
  PackageModelRaw,
  PackageRaw,
  mapPackageRawToPackage,
  mapPackageToPackageRaw,
} from '@dependency-health-monitor/dependency-fetcher';

export const FETCH_CONCURRENCY = 50;
export const ITERATION_DEPTH = 3;
export const QUEUE_SERVICE_API_RUNNER_BASE_URL = 'http://localhost:4001/api/v1/api-runner';
export const POST_PACKAGE_URL = 'http://localhost:3000/api/package';

const bodyModel = z.object({
  package: PackageModelRaw,
  depth: z.number(),
  packageManagerName: PackageManagerNamesModel,
});

function fetchNewPackage({
  pkg,
  depth,
  packageManagerName,
}: {
  pkg: PackageRaw;
  depth: number;
  packageManagerName: PackageManagerNames;
}) {
  return fetch(QUEUE_SERVICE_API_RUNNER_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: POST_PACKAGE_URL,
      init: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          package: pkg,
          depth,
          packageManagerName,
        },
      },
    }),
  });
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const parsedBody = bodyModel.parse(body);

    console.debug(
      '[API] ',
      `Aggregating packages at depth ${parsedBody.depth.toString().padStart(1, '0')} for ${parsedBody.package.name}`,
    );

    const packageManager = DependencyFetcher.getPackageManagerByName(parsedBody.packageManagerName);
    const rootPackage = mapPackageRawToPackage(parsedBody.package);
    const newPkgs = await packageManager.createPackages(rootPackage);
    await packageManager.createPackageRelations(rootPackage);

    if (!newPkgs || newPkgs.length === 0) {
      console.log('[API]', `No new dependencies found for ${parsedBody.package.name}`);
    }

    if (newPkgs && parsedBody.depth < ITERATION_DEPTH) {
      await pMap(
        newPkgs,
        async (pkg) =>
          fetchNewPackage({
            pkg: mapPackageToPackageRaw(pkg),
            depth: parsedBody.depth + 1,
            packageManagerName: parsedBody.packageManagerName,
          }),
        {
          concurrency: FETCH_CONCURRENCY,
        },
      );
    }

    return `Successfully processed package ${parsedBody.package.name}`;
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return createError({
        statusCode: 400,
        data: error.issues,
      });
    }

    return createError({
      statusCode: 500,
      data: error,
    });
  }
});
