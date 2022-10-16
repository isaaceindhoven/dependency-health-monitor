import { Package } from './Package/PackageModel.js';
import NpmPackageManager from './PackageManager/npm/NpmIoPackageManager';

const PackageManagerNames = ['npm'] as const;

export class DependencyFetcher {
  private pkgFile: string;

  private packageManager;

  constructor(pkgFile: string, fileName?: string) {
    const packageManager = fileName
      ? this.getPackageManagerByFileName(fileName)
      : this.getPackageManagerByPkgFile(pkgFile);
    this.pkgFile = pkgFile;
    this.packageManager = new packageManager(pkgFile);
  }

  getPackageManagerByPkgFile(pkgFile: string) {
    if (NpmPackageManager.validateIfNpmByPkgFile(pkgFile)) {
      return NpmPackageManager;
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
        return NpmPackageManager;
      // case 'composer.json':
      //   return ComposerPackageManager;
      // case 'pom.xml':
      //   return MavenPackageManager;
      default:
        throw new Error(`Invalid pkgFile. No package manager found for file name ${fileName}`);
    }
  }

  transformPackagesToObject(packages: Map<string, Package>): Record<string, Package> {
    return [...packages].reduce((acc, [key, value]) => {
      return {
        ...acc,
        [key]: {
          ...value,
          dependents: [...value.dependents],
          dependencies: [...value.dependencies],
        },
      };
    }, {} as Record<string, any>);
  }

  async fetch() {
    const { packages } = await this.packageManager.fetch(this.pkgFile);
    return {
      packages: this.transformPackagesToObject(packages),
      // errors: Object.fromEntries(errors),
    };
  }

  async aggregate(): Promise<{
    packages: Record<string, any>;
    // errors: Record<string, any>;
  }> {
    const { packages } = await this.packageManager.aggregate(this.pkgFile);
    return {
      packages: this.transformPackagesToObject(packages),
      // errors: Object.fromEntries(errors),
    };
  }

  async fetchOrAggregate() {
    // const exists = await this.packageManager.exists(this.pkgFile);
    // if (exists) {
    //   return this.fetch();
    // } else {

    // }

    return this.aggregate();
  }

  static async fetchPackageFile(pkgName: string, packageManagerName: typeof PackageManagerNames[number]) {
    const packageManager = this.getPackageManagerByName(packageManagerName);
    return packageManager.fetchPackageFile(pkgName);
  }

  static getPackageManagerByName(name: typeof PackageManagerNames[number]) {
    switch (name) {
      case 'npm':
        return NpmPackageManager;
      // case 'composer':
      //   return ComposerPackageManager;
      // case 'maven':
      //   return MavenPackageManager;
      default:
        throw new Error('Invalid package manager name. No package manager found.');
    }
  }
}
