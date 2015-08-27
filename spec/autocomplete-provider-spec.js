'use babel';
/* @flow */

describe('Love2D Autocompletions', () => {
	var provider;

	beforeEach(() => {
		waitsForPromise(() => atom.packages.activatePackage('love-plus'))

		runs(() => {
			provider = atom.packages.getActivePackage('love-plus').mainModule.getAutoCompleteProvider();
			expect(provider).not.toBeNull();
		})
	});

	it('', () => {
	});
});