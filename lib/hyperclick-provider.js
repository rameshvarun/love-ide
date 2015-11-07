'use babel';
/* @flow */

import {Range, Point} from 'atom';
import {data} from './autocomplete-provider';
import shell from 'shell';

const PREFIX_REGEX = /[a-zA-Z0-9][a-zA-Z0-9_\.]*$/;
const SUFFIX_REGEX = /^[a-zA-Z0-9_\.]*/;

export var provider: HyperclickProvider = {
	getSuggestionForWord(editor: atom$TextEditor, text: string, range: atom$Range): ?HyperclickSuggestion  {
    var query = text;
    var displayRange = range;

    var prefix = editor.getTextInBufferRange(new Range(new Point(range.start.row, 0), range.start));
    var prefixMatch = prefix.match(PREFIX_REGEX);
    if (prefixMatch) {
      query = prefixMatch[0] + query;
      displayRange = new Range(new Point(displayRange.start.row, displayRange.start.column - prefixMatch[0].length), displayRange.end);
    }

    var suffix = editor.getTextInBufferRange(new Range(range.end, new Point(range.end.row, Number.MAX_SAFE_INTEGER)));
    var suffixMatch = suffix.match(SUFFIX_REGEX);
    if (suffixMatch) {
      query = query + suffixMatch[0];
      displayRange = new Range(displayRange.start, new Point(displayRange.end.row, displayRange.end.column + suffixMatch[0].length));
    }

    if (data[query]) {
      return {
        range: displayRange,
        callback() {
          shell.openExternal(data[query].url);
        },
      };
    } else {
      return null;
    }
	},
};
