'use babel';
/* @flow */

import {provider} from './autocomplete-provider';
import install from './installer';
import child_process from 'child_process';
import log4js from 'log4js';

const logger = log4js.getLogger('installer');

export function activate () {
	install();
}

export function getAutoCompleteProvider(): AutocompleteProvider {
	logger.trace('Registering auto-complete provider.');
	return provider;
}

var toolBarSection = null;
export function consumeToolBar(toolBar) {
	logger.trace('Setting up toolbar.');

  toolBarSection = toolBar('love-ide');
	var runButton = toolBarSection.addButton({
		icon: 'play',
		tooltip: 'Run Love App',
		iconset: 'ion',
		callback() {
			var [dir] = atom.project.getPaths();
			child_process.exec('love .', {cwd: dir}, (err, stdout, stderr) => {
				// TODO: Report error.
			});
		}
	});
}

export function deactivate() {
	if (toolBarSection) {
		toolBarSection.removeItems();
	}
}
