/* eslint-disable class-methods-use-this, consistent-return */

import { db, Prisma } from '@dependency-health-monitor/database';
import { NpmsIO } from 'npms.io';
import { formatDuration, intervalToDuration } from 'date-fns';
import { orderBy } from 'lodash-es';
import pMap from 'p-map';
import { z } from 'zod';
import { Package, PackageAuthorModel, PackageFundingModel, PackageModel } from '../../Package/PackageModel';
import { PackageRelation } from '../../PackageRelation/PackageRelationModel';

type Manifest = {
  name: string;
  version: string;
  dependencies?: { [key: string]: string };
  devDependencies?: { [key: string]: string };
};

export class NpmPackageManager {
  private iterationDepth = 3;

  private concurrency = 50;

  protected pkgFile: string;

  protected packages: Map<string, Package>;

  public static npmsIO = new NpmsIO();
  // protected static npmsIO = new NpmsIO();

  constructor(pkgFile: string) {
    this.pkgFile = pkgFile;
    this.packages = new Map();
    // this.packageErrors = new Map();
    // this.npmsIO = new NpmsIO();
  }

  getDependenciesFromManifest(manifest: Manifest) {
    let dependencies = [] as string[];
    if (manifest.dependencies) {
      dependencies = dependencies.concat(Object.keys(manifest.dependencies));
    }
    if (manifest.devDependencies) {
      dependencies = dependencies.concat(Object.keys(manifest.devDependencies));
    }
    return dependencies;
  }

  transformPackageDataToPackage(data: any): Package | undefined {
    const { name, version, author, funding } = data;
    try {
      const dependencies = this.getDependenciesFromManifest(data);
      const sanitizedAuthor = typeof author === 'string' ? [author] : author;
      const sanitizedFunding = typeof funding === 'string' ? [funding] : funding;
      return {
        name,
        version,
        funding: PackageFundingModel.parse(sanitizedFunding),
        author: PackageAuthorModel.parse(sanitizedAuthor),
        dependents: new Set(),
        dependencies: new Set(dependencies),
      };
    } catch (error) {
      console.error(error);
      // this.packageErrors.set(name, error);
      
    }
  }

  getPackageDataFromPkgFile(pkgFile: string): Package | undefined {
    const data = JSON.parse(pkgFile);
    return this.transformPackageDataToPackage(data);
  }

  async aggregatePackages(rootPackage: Package, depth = 0) {
    console.log(`Aggregating packages at depth ${depth.toString().padStart(1, '0')} for ${rootPackage.name}`);
    const newPkgs = await this.createPackages(rootPackage);
    await this.createPackageRelations(rootPackage);
    if (newPkgs && depth < this.iterationDepth) {
      await pMap(newPkgs, async (pkg) => this.aggregatePackages(pkg, depth + 1), { concurrency: 1 });
    }
  }

  async createPackages(rootPackage: Package) {
    const existingPackages = await db.package.findMany({
      select: { name: true },
      where: { name: { in: [...rootPackage.dependencies] } },
    });

    const newDependencies = [...rootPackage.dependencies].filter(
      (dep) => !existingPackages.find(({ name }) => name === dep),
    );

    if (newDependencies.length > 0) {
      const pkgsDataFromRegistry = await this.getPackagesDataFromRegistry(newDependencies);
      const pkgsData = pkgsDataFromRegistry
        ?.filter((pkg) => !!pkg)
        .map((pkg) => this.transformPackageDataToPackage(pkg));

      if (pkgsData) {
        await db.package.createMany({
          data: pkgsData.map((pkgdData) => {
            const { name, version, author, funding } = pkgdData as Package;
            return {
              name,
              version,
              author,
              funding,
            };
          }),
        });

        return pkgsData as Package[];
      }
    }
  }

  async createPackageRelations(rootPackage: Package) {
    if (rootPackage.dependencies.size > 0) {
      const existingRelations = await db.packageRelations.findMany({
        select: { dependentName: true, dependencyName: true },
        where: {
          AND: [
            {
              dependentName: rootPackage.name,
              dependencyName: { in: [...rootPackage.dependencies] },
            },
          ],
        },
      });

      const newDependencies = [...rootPackage.dependencies].filter(
        (name) => !existingRelations.find(({ dependencyName }) => dependencyName === name),
      );

      const data = newDependencies.map((dependencyName) => ({
          dependentName: rootPackage.name,
          dependencyName,
        }));

      await db.packageRelations.createMany({ data });
    }
  }

  async getPackagesDataFromRegistry(pkgs: string[]) {
    return NpmPackageManager.npmsIO.api.package
      .multiPackageInfo(pkgs)
      .then((data) => Object.values(data).map((pkgData) => pkgData.collected.metadata as any))
      .catch((error) => {
        console.error(error);
      });
  }

  async getPackageRelationsFromDatabase(pkgs: Set<string>): Promise<PackageRelation[]> {
    const pkgsNames = Prisma.join([...pkgs]);

    const query = await db.$queryRaw`WITH RECURSIVE AllPackages (dependentName, dependencyName) AS (
      SELECT pr.dependentName,
        pr.dependencyName
      FROM PackageRelations pr
      WHERE pr.dependentName IN (${pkgsNames})
      UNION
      SELECT prr.dependentName,
        prr.dependencyName
        FROM PackageRelations prr,
        AllPackages ap
      WHERE prr.dependentName = ap.dependencyName
      LIMIT 100000
    )
    SELECT *
    FROM AllPackages;
  `;

    return query as Array<PackageRelation>;
  }

  async getPackagesDataFromDatabase(pkgs: string[]) {
    const packages = await db.package.findMany({
      select: {
        name: true,
        version: true,
        author: true,
        funding: true,
        dependents: { select: { dependentName: true } },
        dependencies: { select: { dependencyName: true } },
      },
      where: { name: { in: pkgs } },
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

  getPackagesFromRelations(relations: Array<PackageRelation>) {
    const packages = new Set<string>();
    relations.forEach((relation) => {
      packages.add(relation.dependentName);
      packages.add(relation.dependencyName);
    });
    return orderBy([...packages]);
  }

  async fetch(pkgFile: string) {
    // const startDate = new Date();
    const pkgFilePackage = this.getPackageDataFromPkgFile(pkgFile);
    if (pkgFilePackage) {
      const relations = await this.getPackageRelationsFromDatabase(pkgFilePackage.dependencies);
      const uniquePackages = this.getPackagesFromRelations(relations);
      const packages = await this.getPackagesDataFromDatabase(uniquePackages);
      const parsedPackages = z.array(PackageModel).parse(packages);
      this.packages = new Map(parsedPackages.map((pkg) => [pkg.name, pkg]));
    }
    // const endDate = new Date();
    // console.log(
    //   formatDuration(
    //     intervalToDuration({
    //       start: startDate,
    //       end: endDate,
    //     }),
    //   ),
    // );

    return { packages: this.packages };
  }

  async aggregate(pkgFile: string): Promise<{
    packages: Map<string, Package>;
  }> {
    const startDate = new Date();
    const pkgFilePackage = this.getPackageDataFromPkgFile(pkgFile);
    if (pkgFilePackage) {
      await this.aggregatePackages(pkgFilePackage);
      await this.fetch(pkgFile);
    }
    const endDate = new Date();
    console.log(
      formatDuration(
        intervalToDuration({
          start: startDate,
          end: endDate,
        }),
      ),
    );
    return { packages: this.packages };
  }

  async exists(pkgFile: string): Promise<boolean> {
    const pkgFilePackage = this.getPackageDataFromPkgFile(pkgFile);
    if (pkgFilePackage) {
      const packageAmount = await db.package.count({
        where: { name: { in: [...pkgFilePackage.dependencies] } },
      });
      return packageAmount === pkgFilePackage.dependencies.size;
    }
    throw new Error("Can't parse pkgFilePackage");
  }

  static validateIfNpmByPkgFile(pkgFile: string) {
    const requiredKeys = ['name', 'version'];
    const atLeastKeys = ['dependencies', 'devDependencies'];
    try {
      const json = JSON.parse(pkgFile);
      const hasRequiredKeys = requiredKeys.every((key) => Object.keys(json).includes(key));
      const hasAtLeast = atLeastKeys.some((key) => Object.keys(json).includes(key));
      return hasRequiredKeys && hasAtLeast;
    } catch {
      return false;
    }
  }

  static async fetchPackageFile(pkgName: string) {
    return this.npmsIO.api.package.packageInfo(pkgName).then((data) => data.collected.metadata as any);
  }
}
