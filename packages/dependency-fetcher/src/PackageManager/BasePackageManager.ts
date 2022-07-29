import pMap from 'p-map';
import { Package } from '../Package/PackageModel';

export default abstract class BasePackageManager {
  private iterationDepth = 3;
  private concurrency = 50;
  protected input: string;
  protected packages: Map<string, Package>;
  protected packageErrors: Map<string, any>;

  constructor(input: string) {
    this.input = input;
    this.packages = new Map();
    this.packageErrors = new Map();
  }

  getPackageDataFromInput(input: string): Package {
    throw new Error('Not implemented in BasePackageManager');
  }

  async getPackageDataFromRegistry(packageName: string): Promise<Package | undefined> {
    throw new Error('Not implemented in BasePackageManager');
  }

  getPackagesFromManifest(manifest: any): string[] {
    throw new Error('Not implemented in BasePackageManager');
  }

  async iteratePackagesFromRegistry(rootPackage: Package, depth = 0) {
    const newPackageData = await pMap(
      [...rootPackage.edgesOut],
      async (pkgName) => {
        const hasExistingPackage = this.packages.has(pkgName);

        console.log(rootPackage.name.padEnd(40), pkgName.padEnd(40), (!!hasExistingPackage).toString().padEnd(10));

        if (hasExistingPackage) {
          const existingPackage = this.packages.get(pkgName) as Package;
          const edgesIn = existingPackage.edgesIn.add(rootPackage.name);
          const newPackage = { ...existingPackage, edgesIn };
          this.packages.set(pkgName, newPackage);
          return;
        } else {
          const pkgData = await this.getPackageDataFromRegistry(pkgName);
          if (!pkgData) return;
          this.packages.set(pkgName, pkgData);
          return pkgData;
        }
      },
      { concurrency: this.concurrency },
    );

    if (depth >= this.iterationDepth) return;

    await pMap(
      newPackageData.filter((pkg) => !!pkg) as Package[],
      async (pkg) => {
        await this.iteratePackagesFromRegistry(pkg, depth + 1);
      },
      { concurrency: 1 },
    );
  }

  async aggregate(input: string): Promise<{
    packages: Map<string, Package>;
    errors: Map<string, any>;
  }> {
    const inputPackage = this.getPackageDataFromInput(input);
    await this.iteratePackagesFromRegistry(inputPackage);

    return { packages: this.packages, errors: this.packageErrors };
  }
}
