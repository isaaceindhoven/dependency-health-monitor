import {
  AggregatePackagesOptions,
  DependencyFetcher,
  mapPackageToPackageRaw,
} from '@dependency-health-monitor/dependency-fetcher';
import { z } from 'zod';

async function aggregatePackages({ pkg, depth }: AggregatePackagesOptions) {
  console.log(
    '[name].get',
    `Aggregating packages via queue at depth ${depth.toString().padStart(1, '0')} for ${pkg.name}`,
  );
  try {
    const body = JSON.stringify({
      package: mapPackageToPackageRaw(pkg),
      depth,
      packageManagerName: 'npm',
    });

    await fetch('http://localhost:3000/api/package', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });
  } catch (error) {
    console.error('[name].get', error);
  }
}

export default defineEventHandler(async (event) => {
  try {
    const nameModel = z.string();
    const parsedName = nameModel.parse(event.context.params.name);
    const manifest = await DependencyFetcher.getManifestByName(parsedName, 'npm');

    const dependencyFetcher = new DependencyFetcher({
      pkgFile: JSON.stringify(manifest),
      config: { aggregate: { aggregatePackages } },
    });

    const exists = await dependencyFetcher.packageManager.exists(dependencyFetcher.pkg);

    if (exists) {
      const fetcherResult = await dependencyFetcher.fetch();
      return Object.values(fetcherResult.packages).sort((a, b) => b.count - a.count);
    }

    await dependencyFetcher.aggregate();
    return new Response(undefined, { status: 202 });
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return createError({
        statusCode: 400,
        data: JSON.stringify(error.issues),
      });
    }
    return createError({
      statusCode: 400,
      data: error,
    });
  }
});
