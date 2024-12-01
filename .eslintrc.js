module.exports = {
	parser: "@typescript-eslint/parser",
	parserOptions: {
		project: "tsconfig.json",
		tsconfigRootDir: __dirname,
		sourceType: "module",
	},
	extends: [
		"next/core-web-vitals",
		"plugin:@typescript-eslint/recommended",
		// "plugin:prettier/recommended",
		// "prettier",
	],
	plugins: ["@typescript-eslint/eslint-plugin", "complexity"],
	root: true,
	env: {
		node: true,
		jest: true,
	},
	ignorePatterns: [".eslintrc.js", "embed.js", "prisma/*", "scripts/*"],
	rules: {
		complexity: ["error", 30],
		"@typescript-eslint/ban-ts-ignore": "off",
		"@typescript-eslint/ban-ts-comment": "off",
		"@typescript-eslint/interface-name-prefix": "off",
		"@typescript-eslint/explicit-function-return-type": "off",
		"@typescript-eslint/explicit-module-boundary-types": "off",
		"@typescript-eslint/no-explicit-any": "off",
		"@typescript-eslint/no-unused-vars": "off",
		"@typescript-eslint/eslint-config-prettier": "off",
	},
};
