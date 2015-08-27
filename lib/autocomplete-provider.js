'use babel';
/* @flow */

export var selector = '.source.lua';
export var disableForSelector = '.source.lua .comment';

type AutocompleteSuggestion = {
	text?: string;
	snippet?: string;
	displayText?: string;
	replacementPrefix?: string;
	type?: string;
	leftLabel?: string;
	leftLabelHTML?: string;
	rightLabel?: string;
	rightLabelHTML?: string;
	className?: string;
	iconHTML?: string;
	description?: string;
	descriptionMoreURL?: string;
};

export async function getSuggestions(): Promise<AutocompleteSuggestion> {
	return {
			text: 'someText',
			displayText: 'displayText',
			type: 'function',
			description: 'test desc.',
			descriptionMoreURL: 'https://www.google.com'
	};
}