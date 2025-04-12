/* eslint-disable @typescript-eslint/no-unused-vars */
import pluginVue from 'eslint-plugin-vue';
import vueTsEslintConfig from '@vue/eslint-config-typescript';
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting';

module.exports = {
  // 使用 TypeScript 解析器
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    '@vue/typescript/recommended',
    // 其他扩展...
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off', // 如果需要使用 any，可以保留
    'vue/multi-word-component-names': 'off',    // 关闭 Vue 组件命名规则
    // 其他自定义规则...
  },
};

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
  },
  ...pluginVue.configs['flat/essential'],
  ...vueTsEslintConfig(),
  skipFormatting,
];
