// Declarations for the 2.0.0 autocomplete-plus provider API.
// May not be correct.

declare type AutocompleteSuggestion = {
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

declare type SuggestionRequest = {
	editor: atom$TextEditor;
	bufferPosition: atom$Point;
	scopeDescriptor: Array<string>;
	prefix: string;
};

declare type AutocompleteProvider = {
	selector: string;
	getSuggestions: (request: SuggestionRequest) => Promise<Array<AutocompleteSuggestion>>;

	disableForSelector?: string;
	inclusionPriority?: number;
	excludeLowerPriority?: boolean;
	dispose?: () => void;

	// TODO:
	onDidInsertSuggestion?: () => void;
}
