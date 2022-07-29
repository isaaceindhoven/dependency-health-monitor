;import pacote from 'pacote';
import { Package, PackageFunding } from '../Package/PackageModel.js';
import BasePackageManager from './BasePackageManager.js';

type Manifest = {
  name: string;
  version: string;
  dependencies?: { [key: string]: string };
  devDependencies?: { [key: string]: string };
};

export default class NpmPackageManager extends BasePackageManager {
  constructor(input: string) {
    super(input);
  }

  getPackagesFromManifest(manifest: Manifest) {
    let packages = [] as string[];
    if (manifest.dependencies) {
      packages = packages.concat(Object.keys(manifest.dependencies));
    }
    if (manifest.devDependencies) {
      packages = packages.concat(Object.keys(manifest.devDependencies));
    }
    return packages;
  }

  transformPackageDataToPackage(data: any): Package {
    const { name, version, author } = data;
    const packages = this.getPackagesFromManifest(data);
    return {
      name,
      version,
      funding: data.funding as PackageFunding,
      edgesOut: new Set(packages),
      edgesIn: new Set(),
      author,
    };
  }

  getPackageDataFromInput(input: string): Package {
    const data = JSON.parse(input);
    return this.transformPackageDataToPackage(data);
  }

  async getPackageDataFromRegistry(packageName: string): Promise<Package | undefined> {
    const data = await pacote.manifest(packageName, { fullMetadata: true }).catch((error) => {
      this.packageErrors.set(packageName, error);
      return undefined;
    });
    return data && this.transformPackageDataToPackage(data);
  }

  static validateIfNpmByInput(input: string) {
    const requiredKeys = ['name', 'version'];
    const atLeastKeys = ['dependencies', 'devDependencies'];
    try {
      const json = JSON.parse(input);
      const hasRequiredKeys = requiredKeys.every((key) => Object.keys(json).includes(key));
      const hasAtLeast = atLeastKeys.some((key) => Object.keys(json).includes(key));
      return hasRequiredKeys && hasAtLeast;
    } catch {
      return false;
    }
  }
}
