'use babel';
/* @flow */

import {filter} from 'fuzzaldrin';
import fs from 'fs';
import path from 'path';
import JSON5 from 'json5';
import {Range, Point} from 'atom';

export var data = JSON5.parse(fs.readFileSync(path.join(__dirname, 'data.json5')));
var keys = Object.keys(data);

export var provider: AutocompleteProvider = {
	selector: '.source.lua',
	disableForSelector: '.source.lua .comment',

	async getSuggestions(request: SuggestionRequest): Promise<Array<AutocompleteSuggestion>> {
		var prefix = getPrefix(request.editor, request.bufferPosition);
		if (prefix.length === 0) return [];

		var results: Array<string> = filter(keys, prefix);
		return results.map(name => {
			var completion = data[name];
			var suggestion: AutocompleteSuggestion = {
				displayText: name,
				description: completion.description,
				descriptionMoreURL: completion.url,
				type: completion.type,
				replacementPrefix: prefix
			};
			if (completion.snippet)
				suggestion.snippet = completion.snippet;
			else
				suggestion.text = name;
			return suggestion;
		});

		/*return [{
				text: 'someText',
				displayText: 'displayText',
				type: 'function',
				description: 'test desc.',
				descriptionMoreURL: 'https://www.google.com'
		}];*/
	},
};

// TODO: For callbacks, detect if a user has already typed 'function'.

function getPrefix(editor: atom$TextEditor, bufferPosition: atom$Point): string {
  var regex = /[a-zA-Z0-9][a-zA-Z0-9_\.]*$/;
	var line = editor.getTextInBufferRange(new Range(
		new Point(bufferPosition.row, 0), bufferPosition));

	var match = line.match(regex);
	if (match) return match[0];
	else return '';
};
