module.exports = {
	extends: 'stylelint-config-standard',
	ignoreFiles: 'node_modules/{,**/}*',
	rules: {
		'no-descending-specificity': null,
		indentation: [
			'tab',
			{
				except: [ 'value' ]
			}
		]
	}
};
