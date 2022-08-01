import { Package } from './Package/PackageModel.js';
import NpmPackageManager from './PackageManager/npm/NpmIoPackageManager';

export class DependencyFetcher {
  private input: string;

  private packageManager;

  constructor(input: string, fileName?: string) {
    const packageManager = fileName ? this.getPackageManagerByFileName(fileName) : this.getPackageManagerByInput(input);
    this.input = input;
    this.packageManager = new packageManager(input);
  }

  getPackageManagerByInput(input: string) {
    if (NpmPackageManager.validateIfNpmByInput(input)) {
      return NpmPackageManager;
    }
    // if (ComposerPackageManager.validateIfNpmByInput(input)) {
    //   return ComposerPackageManager;
    // }
    // if (MavenPackageManager.validateIfNpmByInput(input)) {
    //   return MavenPackageManager;
    // }
    throw new Error('Invalid input. No package manager found.');
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
        throw new Error(`Invalid input. No package manager found for file name ${fileName}`);
    }
  }

  transformPackagesToObject(packages: Map<string, Package>) {
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
    const { packages } = await this.packageManager.fetch(this.input);
    return {
      packages: this.transformPackagesToObject(packages),
      // errors: Object.fromEntries(errors),
    };
  }

  async aggregate(): Promise<{
    packages: Record<string, any>;
    // errors: Record<string, any>;
  }> {
    const { packages } = await this.packageManager.aggregate(this.input);
    return {
      packages: this.transformPackagesToObject(packages),
      // errors: Object.fromEntries(errors),
    };
  }

  async fetchOrAggregate() {
    // const exists = await this.packageManager.exists(this.input);
    // if (exists) {
    //   return this.fetch();
    // } else {

    // }

    return this.aggregate();
  }
}
