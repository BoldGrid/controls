// http://eslint.org/docs/user-guide/configuring

module.exports = {
	root: true,
	parser: 'babel-eslint',
	parserOptions: {
		sourceType: 'module'
	},
	env: {
		browser: true
	},

	// https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
	extends: [ "plugin:@wordpress/eslint-plugin/recommended" ],
	plugins: [ 'html' ],

	// Add your custom rules here
	rules: {
		'space-in-parens': [ 'error', 'always' ],

		// Allow async-await
		'generator-star-spacing': 0,

		// Allow debugger during development
		'no-debugger': 'production' === process.env.NODE_ENV ? 2 : 0
	}
};
