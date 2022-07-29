import { Package } from './Package/PackageModel.js';
import NpmPackageManager from './PackageManager/NpmPackageManager.js';

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
    throw new Error('No package manager found');
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
        throw new Error(`No package manager found for file name ${fileName}`);
    }
  }

  transformPackagesToObject(packages: Map<string, Package>) {
    return [...packages].reduce((acc, [key, value]) => {
      return {
        ...acc,
        [key]: {
          ...value,
          edgesOut: [...value.edgesOut],
          edgesIn: [...value.edgesIn],
        },
      };
    }, {} as Record<string, any>);
  }

  async aggregate(): Promise<{
    packages: Record<string, any>;
    errors: Record<string, any>;
  }> {
    const { packages, errors } = await this.packageManager.aggregate(this.input);
    return {
      packages: this.transformPackagesToObject(packages),
      errors: Object.fromEntries(errors),
    };
  }
}
