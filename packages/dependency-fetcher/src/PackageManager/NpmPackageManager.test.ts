/* eslint-disable @typescript-eslint/ban-ts-comment */
import { describe, it, expect, vi } from 'vitest';
import NpmPackageManager from './NpmPackageManager';
import pacote from 'pacote';

const manifestInput = {
  name: 'npm-package-manager-test-input',
  version: '0.0.0',
  dependencies: { lodash: 'latest' },
  devDependencies: { commander: 'latest' },
};
const input = JSON.stringify(manifestInput);

describe('NpmPackageManager', () => {
  it('getPackagesFromManifest', async () => {
    const npmPackageManager = new NpmPackageManager(input);
    const packages = npmPackageManager.getPackagesFromManifest(manifestInput);
    expect(packages).toEqual(['lodash', 'commander']);
  });

  it('getPackageDataFromRegistry', async () => {
    const dependencies = {
      is: 'latest',
    };
    const devDependencies = {
      was: 'latest',
    };
    const baseMock = {
      name: 'lodash',
      version: 'latest',
      funding: 'funding',
      author: 'Jane Doe',
    };
    const spy = vi
      .spyOn(pacote, 'manifest')
      // @ts-ignore
      .mockImplementation(async () => ({ ...baseMock, dependencies, devDependencies }));
    const npmPackageManager = new NpmPackageManager(input);
    const data = await npmPackageManager.getPackageDataFromRegistry('lodash');
    expect(spy).toHaveBeenCalledWith('lodash', { fullMetadata: true });
    expect(data).toEqual({ ...baseMock, packages: ['is', 'was'] });
  });

  it('validates an npm package input', async () => {
    const isInputValid = NpmPackageManager.validateIfNpmByInput(input);
    expect(isInputValid).toBe(true);
  });

  it('invalidates an invalid npm package input', async () => {
    const isInputValid = NpmPackageManager.validateIfNpmByInput(
      JSON.stringify({ name: 'npm-package-manager-test-input' }),
    );
    expect(isInputValid).toBe(false);
  });
});
