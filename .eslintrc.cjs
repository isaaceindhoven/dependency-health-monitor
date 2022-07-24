/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  extends: ['eslint:recommended', '@vue/eslint-config-typescript/recommended', '@vue/eslint-config-prettier'],
  env: {
    'vue/setup-compiler-macros': true,
  },
  rules: {
    '@typescript-eslint/ban-ts-comment': ['error', { 'ts-ignore': 'allow-with-description' }],
  },
  overrides: [
    {
      files: ['packages/frontend/src/**/*', 'packages/frontend/src/**/*.vue', 'packages/frontend/env.d.ts'],
      extends: ['plugin:vue/vue3-essential'],
      rules: { 'vue/multi-word-component-names': 'off', '@typescript-eslint/no-explicit-any': 'off' },
    },
    {
      files: ['packages/frontend/cypress/integration/**.spec.{js,ts,jsx,tsx}'],
      extends: ['plugin:cypress/recommended'],
    },
    {
      files: ['commitlint.config.cjs'],
      env: {
        node: true,
      },
    },
  ],
};
