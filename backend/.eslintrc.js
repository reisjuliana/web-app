module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['prettier'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    "prettier/prettier": [
      "error",
      {
        "printWidth": 100,
        "singleQuote": true,
        "trailingComma": "all",
        "arrowParens": "always",
        "bracketSpacing": true,
        "semi": true,
        "endOfLine": "lf",
        "proseWrap": "never",
        "functionParenNewline": "ignore" // <<<<<<<<<< ignora quebra de linha de parâmetros
      }
    ]
  },
};
