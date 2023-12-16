import { describe, test, expect } from 'vitest';
import { PackageRaw, mapPackageRawToPackage } from './PackageModel.js';

const packageRaw: PackageRaw = {
  name: 'serialport',
  version: '9.2.0',
  dependents: [],
  dependencies: [
    '@serialport/binding-mock',
    '@serialport/bindings-cpp',
    '@serialport/parser-byte-length',
    '@serialport/parser-cctalk',
    '@serialport/parser-delimiter',
    '@serialport/parser-inter-byte-timeout',
    '@serialport/parser-packet-length',
    '@serialport/parser-readline',
    '@serialport/parser-ready',
    '@serialport/parser-regex',
    '@serialport/parser-slip-encoder',
    '@serialport/parser-spacepacket',
    '@serialport/stream',
  ],
};

describe('PackageModel', () => {
  test('mapPackageRawToPackage', () => {
    const pkg = mapPackageRawToPackage(packageRaw);
    expect(pkg.dependencies).toBeInstanceOf(Set);
    expect(pkg.dependencies.size).toBe(13);
  });
});
