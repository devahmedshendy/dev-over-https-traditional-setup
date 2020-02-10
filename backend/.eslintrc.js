module.exports = {
  root: true,
  env: {
    es6: true,
    node: true
  },
  extends: [
    'prettier',
    'plugin:prettier/recommended'
  ],
  rules: {
    'no-console': 'off',
    'prettier/prettier': 'error',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  },
  parser: 'babel-eslint',
  plugins: ['prettier']
}