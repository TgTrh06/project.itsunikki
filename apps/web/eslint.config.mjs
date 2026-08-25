import tseslint from 'typescript-eslint';

export default tseslint.config({
  files: ['src/**/*.ts', 'src/**/*.tsx'],
  extends: [...tseslint.configs.recommended],
});
