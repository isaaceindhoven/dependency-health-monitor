import { describe, it, expect } from 'vitest';
import { parsePackageJSONStringToObject } from '../json-parser';

const validJSON = {
  name: 'dependency-health-monitor',
  version: '0.0.0',
  scripts: {
    dev: 'vite',
  },
  dependencies: {
    pinia: '^2.0.13',
  },
  devDependencies: {
    '@commitlint/cli': '^16.2.3',
  },
};

const validPackageJSONString = JSON.stringify(validJSON);

describe('parse json', () => {
  it('parses valid package.json string into json object', () => {
    expect(() => parsePackageJSONStringToObject(validPackageJSONString)).not.toThrowError();
  });

  it('throws an error whenever no dev- and dependencies key is present in the package.json', () => {
    const clone: Record<string, unknown> = { ...validJSON};
    delete clone.dependencies;
    delete clone.devDependencies;

    const faultyPackageJSONString = JSON.stringify(clone);

    expect(() => parsePackageJSONStringToObject(faultyPackageJSONString)).toThrowError(
      /^Package.json does not contain any dependencies or devDependencies.$/,
    );
  });

  it('throws an error whenever the JSON syntax is wrong', () => {
    const faultyJSONSyntaxString = validPackageJSONString.replace('}', '');

    expect(() => parsePackageJSONStringToObject(faultyJSONSyntaxString)).toThrowError(
      /^Invalid JSON object, please verify object.$/,
    );
  });

  it('throws Invalid JSON object error when both the JSON syntax is wrong and no dev- and dependency key is present', () => {
    const clone: Record<string, unknown> = { ...validJSON};
    delete clone.dependencies;
    delete clone.devDependencies;

    const faultyPackageJSONString = JSON.stringify(clone).replace('{', '');

    expect(() => parsePackageJSONStringToObject(faultyPackageJSONString)).toThrowError(
      /^Invalid JSON object, please verify object.$/,
    );
  });
});
