'use babel';
/* @flow */

import {provider} from './autocomplete-provider';
import install from './installer';

export function activate () {
	install();
}

export function getAutoCompleteProvider(): AutocompleteProvider {
	return provider;
}

export function deactivate() {}
