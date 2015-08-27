'use babel';
/* @flow */

import * as autocomplete_provider from './autocomplete-provider';

export function activate () {}

export function getAutoCompleteProvider() {
	return autocomplete_provider;
}

export function deactivate() {}