export default {
	testEnvironment: 'jest-environment-node',
	transform: {},
	coveragePathIgnorePatterns: [
		'/node_modules/',
		'**/*.ts',
	],
	testPathIgnorePatterns: [
		'^.*\\.(ts)$',
	],
};
