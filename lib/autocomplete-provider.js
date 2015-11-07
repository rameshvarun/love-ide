'use babel';
/* @flow */

import {filter} from 'fuzzaldrin';
import fs from 'fs';
import path from 'path';
import {Range, Point} from 'atom';

export var data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'api.json')).toString());
var keys = Object.keys(data);

export var config_api = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'config-api.json')).toString());
var config_keys = Object.keys(config_api);

export var provider: AutocompleteProvider = {
	selector: '.source.lua',
	disableForSelector: '.source.lua .comment',

	async getSuggestions(request: SuggestionRequest): Promise<Array<AutocompleteSuggestion>> {
		var prefix = getPrefix(request.editor, request.bufferPosition);
		if (prefix.length === 0) return [];

		if (request.editor.getTitle() === 'conf.lua') {
			return filter(config_keys, prefix).map(name => {
				var completion = config_api[name];

				var suggestion: AutocompleteSuggestion = {
					displayText: name,
					description: completion.description,
					descriptionMoreURL: completion.url,
					type: 'property',
					rightLabel: completion.default,
					leftLabel: completion.type,
					replacementPrefix: prefix,
				};
				suggestion.snippet = `${name} = \${1:${completion.default}}`;

				return suggestion;
			});
		} else {
			return filter(keys, prefix).map(name => {
				var completion = data[name];
				var suggestion: AutocompleteSuggestion = {
					displayText: name,
					description: completion.description,
					descriptionMoreURL: completion.url,
					type: completion.type,
					replacementPrefix: prefix
				};

				if (completion.snippet) {
					suggestion.snippet = completion.snippet;
				} else {
					suggestion.text = name;
				}

				return suggestion;
			});
		}
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
