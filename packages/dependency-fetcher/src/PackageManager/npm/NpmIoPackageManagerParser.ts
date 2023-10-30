import { z } from 'zod';
import { Package, PackageAuthorModel, PackageFundingModel } from '../../Package/PackageModel.js';
import { Manifest, ManifestModel } from './NpmIoPackageManagerModels.js';

export class NpmIoPackageManagerParser {
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

  static getDependenciesFromManifest(manifest: Manifest) {
    const manifestModel = ManifestModel.safeParse(manifest);

    if (!manifestModel.success) {
      throw new Error(
        `Error parsing manifest ${manifest.name}@${manifest.version}: \n ${JSON.stringify(
          manifestModel.error.format(),
          null,
          2,
        )}`,
      );
    }

    let dependencies = [] as string[];
    if (manifest.dependencies) {
      dependencies = dependencies.concat(Object.keys(manifest.dependencies));
    }
    if (manifest.devDependencies) {
      dependencies = dependencies.concat(Object.keys(manifest.devDependencies));
    }
    return dependencies;
  }

  static transformManifestToPackage(data: Manifest): Package {
    const { name, version, author, funding, dependencies, devDependencies } = data;
    try {
      const deps = this.getDependenciesFromManifest({ name, version, dependencies, devDependencies });
      const sanitizedAuthor = typeof author === 'string' ? [author] : author;
      const sanitizedFunding = typeof funding === 'string' ? [funding] : funding;
      return {
        name,
        version,
        funding: PackageFundingModel.parse(sanitizedFunding),
        author: PackageAuthorModel.parse(sanitizedAuthor),
        dependents: new Set(),
        dependencies: new Set(deps),
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new TypeError(`Invalid package data for ${name}. ${error.message}`);
      }
      throw error;
    }
  }

  static getManifestFromPkgFileString(pkgFile: string): Package {
    try {
      const data = JSON.parse(pkgFile);
      const manifestModel = ManifestModel.parse(data);
      return this.transformManifestToPackage(manifestModel);
    } catch (error) {
      console.error(error);
      if (error instanceof z.ZodError) {
        throw new TypeError(
          `Error getting package data from pkg file string \n ${JSON.stringify(error.format(), null, 2)} \n ${JSON.stringify(JSON.parse(pkgFile), null, 2)}`,
        );
      }
      throw error;
    }
  }
}
