import { describe, test, expect, vi, beforeEach, afterAll } from 'vitest';
import { NpmIoPackageManager, Metadata } from './NpmIoPackageManager.js';
import { PackageRepository } from '../../Package/PackageRepository.js';
import { Package } from '../../Package/PackageModel.js';
// import { NpmIoPackageManagerParser } from './NpmIoPackageManagerParser.js';

describe('NpmIoPackageManager', () => {
  describe('aggregatePackages', async () => {
    const createPackagesSpy = vi.spyOn(NpmIoPackageManager, 'createPackages');
    const createPackageRelationsSpy = vi.spyOn(NpmIoPackageManager, 'createPackageRelations');

    const pkg = {
      name: 'test',
      dependencies: new Set(['dependencies']),
      dependents: new Set(['dependents']),
      funding: [],
      author: [],
      version: '',
    };

    const newPkgs = [
      {
        name: 'newPkgs test 1',
        dependencies: new Set(['newPkgs', '1', 'dependencies']),
        dependents: new Set(['newPkgs', '1', 'dependents']),
        funding: [],
        author: [],
        version: '',
      },
      {
        name: 'newPkgs test 2',
        dependencies: new Set(['newPkgs', '2', 'dependencies']),
        dependents: new Set(['newPkgs', '2', 'dependents']),
        funding: [],
        author: [],
        version: '',
      },
    ];

    beforeEach(() => {
      createPackagesSpy.mockReset();
      createPackageRelationsSpy.mockReset();
    });

    afterAll(() => {
      createPackagesSpy.mockRestore();
      createPackageRelationsSpy.mockRestore();
    });

    test('no new packages', async () => {
      await NpmIoPackageManager.aggregatePackages({
        pkg,
        options: {
          maxDepth: 1,
          concurrency: 1,
          aggregatePackages: async () => {},
        },
        depth: 0,
      });

      createPackagesSpy.mockResolvedValueOnce([]);

      expect(createPackagesSpy).toHaveBeenCalledWith(pkg);
      expect(createPackageRelationsSpy).toHaveBeenCalledTimes(1);
    });

    test('new packages, depth 0', async () => {
      await NpmIoPackageManager.aggregatePackages({
        pkg,
        options: {
          maxDepth: 1,
          concurrency: 1,
          aggregatePackages: async () => {},
        },
        depth: 0,
      });

      createPackagesSpy.mockResolvedValueOnce(newPkgs);

      expect(createPackagesSpy).toHaveBeenCalledWith(pkg);
      expect(createPackageRelationsSpy).toHaveBeenCalledTimes(1);
      expect(createPackageRelationsSpy).toHaveBeenCalledWith(pkg);
    });
  });

  describe('createPackages', () => {
    const findManyByDependenciesSpy = vi.spyOn(PackageRepository, 'findManyByDependencies');
    const getPackagesDataFromRegistrySpy = vi.spyOn(NpmIoPackageManager, 'getPackagesDataFromRegistry');
    const createManySpy = vi.spyOn(PackageRepository, 'createMany');
    // const NpmIoPackageManagerParserSpy = vi
    //   .spyOn(NpmIoPackageManager.parser, 'transformManifestToPackage')
    //   .mockImplementation((pkg: any) => pkg);

    beforeEach(() => {
      findManyByDependenciesSpy.mockReset();
      getPackagesDataFromRegistrySpy.mockReset();
      createManySpy.mockReset();
    });

    afterAll(() => {
      findManyByDependenciesSpy.mockRestore();
      getPackagesDataFromRegistrySpy.mockRestore();
      createManySpy.mockRestore();
    });

    test.skip('new dependencies, packages created', async () => {
      const pkg: Package = {
        name: 'test',
        dependencies: new Set(['dependencies']),
        dependents: new Set(['dependents']),
        funding: [],
        author: [],
        version: '',
      };

      const existingPackages: Package[] = [
        {
          name: 'newPkgs test 1',
          dependencies: new Set(['newPkgs', '1', 'dependencies']),
          dependents: new Set(['newPkgs', '1', 'dependents']),
          funding: [],
          author: [],
          version: '',
        },
        {
          name: 'newPkgs test 2',
          dependencies: new Set(['newPkgs', '2', 'dependencies']),
          dependents: new Set(['newPkgs', '2', 'dependents']),
          funding: [],
          author: [],
          version: '',
        },
      ];

      const metadata: Partial<Metadata>[] = [
        {
          name: 'newPkgs test 1',
          dependencies: {
            newPkgs: '^1.0.0',
          },
        },
        {
          name: 'newPkgs test 2',
          dependencies: {
            newPkgs: '^2.0.0',
          },
        },
      ];

      findManyByDependenciesSpy.mockResolvedValueOnce(existingPackages);
      getPackagesDataFromRegistrySpy.mockResolvedValueOnce(metadata as Metadata[]);
      // NpmIoPackageManagerParserSpy.mockReturnValueOnce(existingPackages[0]);

      const returnValue = await NpmIoPackageManager.createPackages(pkg);

      expect(findManyByDependenciesSpy).toHaveBeenCalledOnce();
      expect(getPackagesDataFromRegistrySpy).toHaveBeenCalledWith(['dependencies']);
      expect(createManySpy).toHaveBeenCalledOnce();

      expect(returnValue).toEqual([pkg, ...existingPackages]);
    });

    test('no new dependencies, no packages created', async () => {
      const pkg: Package = {
        name: 'test',
        dependencies: new Set(['dependencies']),
        dependents: new Set(['dependents']),
        funding: [],
        author: [],
        version: '',
      };

      const existingPackages: Package[] = [
        {
          name: 'dependencies',
          dependencies: new Set(['newPkgs']),
          dependents: new Set(['newPkgs', '1']),
          funding: [],
          author: [],
          version: '',
        },
        {
          name: 'dependents',
          dependencies: new Set(['newPkgs', '2']),
          dependents: new Set(['newPkgs', '2']),
          funding: [],
          author: [],
          version: '',
        },
      ];

      findManyByDependenciesSpy.mockResolvedValueOnce(existingPackages);

      const returnValue = await NpmIoPackageManager.createPackages(pkg);

      expect(returnValue).toEqual([]);
    });
  });
  describe.todo('createPackageRelations', () => {});
  describe.todo('getPackagesDataFromRegistry', () => {});
  describe.todo('fetch', () => {});
  describe.todo('aggregate', () => {});
  describe.todo('exists', () => {});
  describe.todo('fetchPackageFile', () => {});
  describe.todo('getManifestByName', () => {});
});
