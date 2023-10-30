import { db } from '@dependency-health-monitor/database';
import { Package, PackageAuthorModel, PackageFundingModel } from './PackageModel.js';

export class PackageRepository {
  static async findManyByNames(packageNames: string[]) {
    const packages = await db.package.findMany({
      select: {
        name: true,
        version: true,
        author: true,
        funding: true,
        dependents: { select: { dependentName: true } },
        dependencies: { select: { dependencyName: true } },
      },
      where: { name: { in: packageNames } },
    });

    return packages
      .map((pkg) => {
        try {
          return {
            ...pkg,
            author: PackageAuthorModel.parse(pkg.author ?? undefined),
            funding: PackageFundingModel.parse(pkg.funding ?? undefined),
            dependencies: new Set(pkg.dependencies.map(({ dependencyName }) => dependencyName)),
            dependents: new Set(pkg.dependents.map(({ dependentName }) => dependentName)),
          };
        } catch (error) {
          console.error(error);
          // this.packageErrors.set(pkg.name, error);
          return undefined;
        }
      })
      .filter((pkg) => !!pkg);
  }

  static async exist(packageName: string) {
    return (await db.package.count({ where: { name: packageName } })) > 0;
  }

  static findManyByDependencies(dependencies: Set<string>) {
    return db.package.findMany({
      select: { name: true },
      where: { name: { in: [...dependencies] } },
    });
  }

  static async countByNames(packageNames: string[]) {
    return db.package.count({
      where: { name: { in: packageNames } },
    });
  }

  static async createMany(packages: Package[]) {
    return db.package.createMany({
      skipDuplicates: true,
      data: packages.map((pkg) => {
        const { name, version, author, funding } = pkg;
        return {
          name,
          version,
          author,
          funding,
        };
      }),
    });
  }
}
