'use babel';
/* @flow */

import invariant from 'assert';

describe('Love2D Autocompletions', () => {
	var provider;

	beforeEach(() => {
		waitsForPromise(() => atom.packages.activatePackage('love-ide'))

		runs(() => {
			var pkg = atom.packages.getActivePackage('love-ide');
			invariant(pkg);

			provider = pkg.mainModule.getAutoCompleteProvider();
			expect(provider).not.toBeNull();
		})
	});

	it('', () => {
	});
});
