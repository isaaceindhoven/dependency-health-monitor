import esbuild from 'esbuild';
import { nodeExternalsPlugin } from 'esbuild-node-externals';

esbuild
  .build({
    entryPoints: ['./financial-health-calculator/index.mts', './npm-dependency-fetcher/index.mts'],
    outdir: 'dist',
    bundle: true,
    minify: true,
    platform: 'node',
    target: 'node16',
    external: ['node-gyp/bin/node-gyp.js'],
    outExtension: {
      '.js': '.mjs',
    },
    plugins: [nodeExternalsPlugin()],
  })
  .catch(() => process.exit(1));
