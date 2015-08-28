'use babel';
/* @flow */

import {provider} from './autocomplete-provider';

export function activate () {}

export function getAutoCompleteProvider(): AutocompleteProvider {
	return provider;
}

export function deactivate() {}
