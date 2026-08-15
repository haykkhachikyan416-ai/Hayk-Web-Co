import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist', 'coverage', 'test-results', '.npm-cache'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      // A concise-arrow effect silently returns whatever the last call returns,
      // and React calls that as the cleanup. Chrome 151 started returning a
      // Promise from window.scrollTo, which crashed the whole layout this way.
      'no-restricted-syntax': [
        'error',
        {
          selector:
            'CallExpression[callee.name=/^use(Effect|LayoutEffect)$/] > ArrowFunctionExpression[body.type!="BlockStatement"]',
          message:
            'Give useEffect a braced body. A concise arrow returns its expression to React as the cleanup function.',
        },
      ],
    },
  },
)
