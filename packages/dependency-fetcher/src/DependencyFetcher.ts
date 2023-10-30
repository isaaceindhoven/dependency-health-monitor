import { z } from 'zod';
import { Package, PackageRawWithCount, PackageWithCount, mapPackageWithCountToPackageRawWithCount } from './Package/PackageModel.js';
import { AggregateOptions, NpmIoPackageManager } from './PackageManager/npm/NpmIoPackageManager.js';

export const PackageManagerNamesModel = z.literal('npm');
export type PackageManagerNames = z.infer<typeof PackageManagerNamesModel>;

type DependencyFetcherOptions = {
  pkgFile: string;
  fileName?: string;
  config?: {
    aggregate?: AggregateOptions;
  };
};

export class DependencyFetcher {
  public pkg: Package;

  private options: DependencyFetcherOptions;

  public packageManager;

  constructor(options: DependencyFetcherOptions) {
    this.packageManager = options.fileName
      ? this.getPackageManagerByFileName(options.fileName)
      : this.getPackageManagerByPkgFile(options.pkgFile);

    const pkg = this.packageManager.parser.getManifestFromPkgFileString(options.pkgFile);

    if (pkg instanceof Error) throw pkg;
    this.pkg = pkg;
    this.options = options;
  }

  getPackageManagerByPkgFile(pkgFile: string) {
    if (NpmIoPackageManager.parser.validateIfNpmByPkgFile(pkgFile)) {
      return NpmIoPackageManager;
    }
    // if (ComposerPackageManager.validateIfNpmByPkgFile(pkgFile)) {
    //   return ComposerPackageManager;
    // }
    // if (MavenPackageManager.validateIfNpmByPkgFile(pkgFile)) {
    //   return MavenPackageManager;
    // }
    throw new Error('Invalid pkgFile. No package manager found.');
  }

  getPackageManagerByFileName(fileName: string) {
    switch (fileName) {
      case 'package.json':
        return NpmIoPackageManager;
      // case 'composer.json':
      //   return ComposerPackageManager;
      // case 'pom.xml':
      //   return MavenPackageManager;
      default:
        throw new Error(`Invalid pkgFile. No package manager found for file name ${fileName}`);
    }
  }

  transformPackagesToObject(packages: Map<string, PackageWithCount>) {
    return [...packages].reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: mapPackageWithCountToPackageRawWithCount(value),
      }),
      {} as Record<string, PackageRawWithCount>,
    );
  }

  async fetch() {
    const { packages } = await this.packageManager.fetch(this.pkg);
    return {
      packages: this.transformPackagesToObject(packages),
      // errors: Object.fromEntries(errors),
    };
  }

  async aggregate(): Promise<void> {
    await this.packageManager.aggregate(this.pkg, this.options.config?.aggregate);
  }

  static async fetchPackageFile(pkgName: string, packageManagerName: PackageManagerNames) {
    const packageManager = this.getPackageManagerByName(packageManagerName);
    return packageManager.fetchPackageFile(pkgName);
  }

  static async getManifestByName(pkgName: string, packageManagerName: PackageManagerNames) {
    const packageManager = this.getPackageManagerByName(packageManagerName);
    return packageManager.getManifestByName(pkgName);
  }

  static getPackageManagerByName(name: PackageManagerNames) {
    switch (name) {
      case 'npm':
        return NpmIoPackageManager;
      // case 'composer':
      //   return ComposerPackageManager;
      // case 'maven':
      //   return MavenPackageManager;
      default:
        throw new Error('Invalid package manager name. No package manager found.');
    }
  }
}
