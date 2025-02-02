import english from './languages/english';

export default ((): typeof english => {
	switch (globalThis?.navigator?.language?.substr(0, 2)) {
		case 'cn':
			return null;
		case 'en':
		default:
			return english;
	}
})();
