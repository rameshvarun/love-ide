'use babel';
/* @flow */

import invariant from 'assert';

describe('Love2D Autocompletions', () => {
	var provider;

	beforeEach(() => {
		waitsForPromise(() => atom.packages.activatePackage('love-plus'))

		runs(() => {
			var package = atom.packages.getActivePackage('love-plus');
			invariant(package);

			provider = package.mainModule.getAutoCompleteProvider();
			expect(provider).not.toBeNull();
		})
	});

	it('', () => {
	});
});
