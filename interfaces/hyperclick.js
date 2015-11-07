declare type HyperclickProvider = {
  getSuggestionForWord(editor: atom$TextEditor, text: string, range: atom$Range): ?HyperclickSuggestion;
};

declare type HyperclickSuggestion = {
  range: atom$Range;
  callback: () => void;
};
