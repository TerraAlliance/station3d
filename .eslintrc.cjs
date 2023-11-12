module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  extends: ["eslint:recommended", "plugin:react/recommended", "plugin:react/jsx-runtime", "plugin:react-hooks/recommended"],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  settings: { react: { version: "18.2" } },
  plugins: ["react-refresh"],
  rules: {
    "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    "react/no-unknown-property": ["off", { ignore: ["JSX"] }],
    "react/prop-types": "off",
    "react/no-children-prop": "off",
    "no-unused-vars": ["error", { ignoreRestSiblings: true }],
    "react-hooks/exhaustive-deps": "off",
    "no-fallthrough": "off",
  },
}
