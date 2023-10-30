import { NpmsIO, PackageInfo } from 'npms.io';
import { defaultsDeep, orderBy } from 'lodash-es';
import pMap from 'p-map';
import { z } from 'zod';
import { Package, PackageModel, PackageWithCount } from '../../Package/PackageModel.js';
import { PackageRelation } from '../../PackageRelation/PackageRelationModel.js';
import { PackageRelationRepository } from '../../PackageRelation/PackageRelationRepository.js';
import { PackageRepository } from '../../Package/PackageRepository.js';
import { NpmIoPackageManagerParser } from './NpmIoPackageManagerParser.js';
import { Logger } from '../../Logger/Logger.js';

export type AggregatePackagesOptions = {
  pkg: Package;
  depth: number;
  options: AggregateOptions;
};

export type RequiredAggregatePackagesOptions = AggregatePackagesOptions & {
  options: Required<AggregateOptions>;
};

export type AggregateOptions = {
  maxDepth?: number;
  concurrency?: number;
  aggregatePackages: (options: AggregatePackagesOptions) => Promise<void>;
};

export class NpmIoPackageManager {
  public static npmsIO = new NpmsIO();

  private static logger = new Logger({ name: 'NpmIoPackageManager' });

  public static parser = NpmIoPackageManagerParser;

  static async aggregatePackages({ pkg, options, depth }: RequiredAggregatePackagesOptions) {
    this.logger.log(`Aggregating packages at depth ${depth.toString().padStart(1, '0')} for ${pkg.name}`);
    const newPkgs = await this.createPackages(pkg);
    await this.createPackageRelations(pkg);
    if (newPkgs && depth < options.maxDepth) {
      await pMap(newPkgs, async (newPkg) => this.aggregatePackages({ pkg: newPkg, options, depth: depth + 1 }), {
        concurrency: options.concurrency,
      });
    }
  }

  static async createPackages(rootPackage: Package) {
    const existingPackages = await PackageRepository.findManyByDependencies(rootPackage.dependencies);

    const newDependencies = [...rootPackage.dependencies].filter(
      (dep) => !existingPackages.find(({ name }) => name === dep),
    );

    if (newDependencies.length > 0) {
      const pkgsDataFromRegistry = await this.getPackagesDataFromRegistry(newDependencies);

      const pkgsData = pkgsDataFromRegistry?.reduce(
        (acc: Package[], pkg: any) => {
          if (!pkg) return acc;
          const transformedPkg = this.parser.transformManifestToPackage(pkg);
          if (transformedPkg) acc.push(transformedPkg);
          return acc;
        },
        // Also add the root package to the list of packages to be created
        [rootPackage] as Package[],
      );

      if (pkgsData) {
        await PackageRepository.createMany(pkgsData);
        return pkgsData as Package[];
      }
    }

    return [];
  }

  static async createPackageRelations(rootPackage: Package) {
    if (rootPackage.dependencies.size > 0) {
      const existingRelations = await PackageRelationRepository.findPackageRelationsByPackageNameAndDependencies({
        dependentName: rootPackage.name,
        dependencies: rootPackage.dependencies,
      });

      const newDependencies = [...rootPackage.dependencies].filter(
        (name) => !existingRelations.find(({ dependencyName }) => dependencyName === name),
      );

      const data = newDependencies.map((dependencyName) => ({
        dependentName: rootPackage.name,
        dependencyName,
      }));

      await PackageRelationRepository.createManyByDependentNameAndDependencies({ data });
    }
  }

  static async getPackagesDataFromRegistry(pkgs: string[]): Promise<PackageInfo['collected']['metadata'][]> {
    return NpmIoPackageManager.npmsIO.api.package
      .multiPackageInfo(pkgs)
      .then((data) => Object.values(data).map((pkgData) => pkgData.collected.metadata))
      .catch((error) => {
        console.error(error);
        return [];
      });
  }

  static getPackagesFromRelations(relations: Array<PackageRelation>) {
    const packages = new Set<string>();
    relations.forEach((relation) => {
      packages.add(relation.dependentName);
      packages.add(relation.dependencyName);
    });
    return orderBy(Array.from(packages));
  }

  static getUniquePackagesAndCountFromRelations(relations: Array<PackageRelation>) {
    const packages = new Map<string, number>();
    relations.forEach((relation) => {
      if (packages.has(relation.dependencyName)) {
        packages.set(relation.dependencyName, packages.get(relation.dependencyName)! + 1);
      } else {
        // packages.set(relation.dependentName, 0);
        packages.set(relation.dependencyName, 0);
      }
    });
    return packages;
  }

  static async fetch(pkg: Package): Promise<{ packages: Map<string, PackageWithCount> }> {
    const relations = await PackageRelationRepository.getAllByPackageNames(pkg.dependencies);
    const uniquePackages = this.getUniquePackagesAndCountFromRelations(relations);
    const allPackages = await PackageRepository.findManyByNames(Array.from(uniquePackages.keys()));
    const parsedPackages = z.array(PackageModel).parse(allPackages);
    const packages = new Map(
      parsedPackages.map((parsedPackage: Package) => {
        const count = uniquePackages.get(parsedPackage.name) || 0;
        return [parsedPackage.name, { ...parsedPackage, count }];
      }),
    );
    return { packages };
  }

  static async aggregate(pkg: Package, options?: AggregateOptions): Promise<void> {
    const optionsWithDefaults: Required<AggregateOptions> = defaultsDeep(options, {
      maxDepth: 3,
      concurrency: 10,
      aggregatePackages: undefined,
    });

    const aggregatePackagesOptions: RequiredAggregatePackagesOptions = { pkg, options: optionsWithDefaults, depth: 0 };
    if (typeof optionsWithDefaults.aggregatePackages === 'function') {
      await optionsWithDefaults.aggregatePackages(aggregatePackagesOptions);
    } else {
      await this.aggregatePackages(aggregatePackagesOptions);
    }
  }

  static async exists(pkgFile: Package): Promise<boolean> {
    return PackageRepository.exist(pkgFile.name);
    // const packageAmount = await PackageRepository.countByNames(Array.from(pkgFile.dependencies));)
    // return packageAmount === pkgFile.dependencies.size;
  }

  static async fetchPackageFile(pkgName: string) {
    return this.npmsIO.api.package
      .packageInfo(pkgName)
      .then((data) => this.parser.transformManifestToPackage(data.collected.metadata));
  }

  static async getManifestByName(name: string) {
    const npmResponse = await fetch(`https://registry.npmjs.com/${name}`).then((res) => res.json());
    return npmResponse.versions?.[npmResponse?.['dist-tags']?.latest];
  }
}
