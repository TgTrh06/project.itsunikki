import tseslint from 'typescript-eslint';

export default tseslint.config({
  files: ['app/**/*.ts', 'app/**/*.tsx', 'lib/**/*.ts'],
  extends: [...tseslint.configs.recommended],
});
