'use babel';
/* @flow */

import JSON5 from 'json5';
import {Range, Point} from 'atom';

export var provider: AutocompleteProvider = {
	selector: '.source.lua',
	disableForSelector: '.source.lua .comment',

	async getSuggestions(request: SuggestionRequest): Promise<Array<AutocompleteSuggestion>> {
		var prefix = getPrefix(request.editor, request.bufferPosition);
		console.log(request.prefix);
		return [{
				text: 'someText',
				displayText: 'displayText',
				type: 'function',
				description: 'test desc.',
				descriptionMoreURL: 'https://www.google.com'
		}];
	},
};

function getPrefix(editor: atom$TextEditor, bufferPosition: atom$Point): string {
	var line = editor.getTextInBufferRange(new Range(
		new Point(bufferPosition.row, 0), bufferPosition));
	return line;
};
