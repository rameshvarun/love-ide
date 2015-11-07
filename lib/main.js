'use babel';
/* @flow */

import install from './installer';
import child_process from 'child_process';
import log4js from 'log4js';

const logger = log4js.getLogger('installer');

export var config = {
	lovePath: {
		title: 'Path to Love Executable',
		description: `This should be the full path to the LOVE executable.
On OSX, this is likely \`/Applications/love.app/Contents/MacOS/love\`.
On Windows, this is likely \`C:\\Program Files (x86)\\LOVE\\love.exe\`
Leave blank to use the executable found in the PATH.`,
		type: 'string',
		default: '',
		order: 1,
	},
	additionalArgs: {
		title: 'Additional Arguments',
		description: `Put any additional arguments to the love executable here. The
executable will be invoked with \`\${lovePath} . \${additionalArgs}\`, with the project
directory as the current working directory.`,
		type: 'string',
		default: '',
		order: 2
	}
}

export function activate () {
	install();
}

export function getAutoCompleteProvider(): AutocompleteProvider {
	logger.trace('Registering auto-complete provider.');
	return require('./autocomplete-provider').provider;
}

export function getHyperclickProvider(): HyperclickProvider {
	logger.trace('Registering hyperclick provider.');
	return require('./hyperclick-provider').provider;
}

var toolBarSection = null;
export function consumeToolBar(toolBar: ToolBar) {
	logger.trace('Setting up toolbar.');

  toolBarSection = toolBar('love-ide');
	var runButton = toolBarSection.addButton({
		icon: 'play',
		tooltip: 'Run Love App',
		iconset: 'ion',
		callback() {
			var [dir] = atom.project.getPaths();
			var lovePath = atom.config.get('love-ide.lovePath') || 'love';
			var additionalArgs = atom.config.get('love-ide.additionalArgs');
			child_process.exec(`${lovePath} . ${additionalArgs}`, {cwd: dir}, (err, stdout, stderr) => {
				if(err) {
					atom.notifications.addFatalError('Error running LOVE.', {
						detail: stderr.toString()
					});
				}
			});
		}
	});
}

export function deactivate() {
	if (toolBarSection) {
		toolBarSection.removeItems();
	}
}
