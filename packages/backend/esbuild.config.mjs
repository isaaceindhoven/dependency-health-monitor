import esbuild from 'esbuild';
import rimraf from 'rimraf';
import { nodeExternalsPlugin } from 'esbuild-node-externals';

rimraf.sync('./dist');

esbuild
  .build({
    entryPoints: ['./financial-health-report/index.mts', './npm-dependency-report/index.mts'],
    outdir: 'dist',
    bundle: true,
    minify: true,
    platform: 'node',
    target: 'node16',
    external: ['node-gyp/bin/node-gyp.js'],
    format: 'cjs',
    outExtension: {
      '.js': '.js',
    },
    plugins: [nodeExternalsPlugin()],
  })
  .catch(() => process.exit(1));
