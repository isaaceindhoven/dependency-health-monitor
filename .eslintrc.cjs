require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'plugin:vue/vue3-recommended',
    '@vue/eslint-config-airbnb-with-typescript',
    'prettier',
  ],
  rules: {
    '@typescript-eslint/ban-ts-comment': ['error', { 'ts-ignore': 'allow-with-description' }],
    'class-methods-use-this': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/no-multiple-template-root': 'off',
    'import/prefer-default-export': 'off',
    'import/extensions': 'off',
    'import/no-relative-packages': 'off',
    'import/no-extraneous-dependencies': 'off',
  },
  overrides: [
    {
      files: ['commitlint.config.cjs'],
      env: {
        node: true,
      },
    },
  ],
};
