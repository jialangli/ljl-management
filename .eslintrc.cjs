module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    parser: '@typescript-eslint/parser'
  },
  plugins: [
    'vue',
    '@typescript-eslint'
  ],
  rules: {
    'vue/multi-word-component-names': 'off', // 关闭组件名必须多个单词的限制
    'vue/max-attributes-per-line': ['error', {
      singleline: 3, // 单行最多3个属性
      multiline: 1    // 多行每行最多1个属性
    }],
    'vue/singleline-html-element-content-newline': 'off', // 单行元素内容换行限制关闭
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-unused-vars': 'warn', // 未使用变量警告，不报错
    'semi': ['error', 'never'], // 禁止使用分号
    'quotes': ['error', 'single'], // 强制使用单引号
    'comma-dangle': ['error', 'never'] // 禁止使用尾逗号
  }
}
