'use babel';
/* @flow */

import child_process from 'child_process';
import log4js from 'log4js';
import fs from 'fs';
import path from 'path';

const logger = log4js.getLogger('installer');
logger.setLevel('ERROR');

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
executable will be invoked with \`"\${lovePath}" . \${additionalArgs}\`, with the project
directory as the current working directory.`,
		type: 'string',
		default: '',
		order: 2,
	}
}

export function activate () {
	require('atom-package-deps').install('love-ide');
}

function run() {
	// Find all the directories that have a main.lua in them.
	var dirs = atom.project.getDirectories().filter(dir =>
		dir.getFile('main.lua').existsSync());

	// No directories were found.
	if(dirs.length == 0) {
		atom.notifications.addError("None of the project directories have a main.lua");
		return;
	}

	// Prioritize the directory of the currently active editor.
	const activeEditor = atom.workspace.getActiveTextEditor();
	dirs.sort((a, b) => {
		if (a.contains(activeEditor.getPath())) return -1;
		if (b.contains(activeEditor.getPath())) return 1;
		else return 0;
	});

	var lovePath = atom.config.get('love-ide.lovePath') || 'love';
	var additionalArgs = atom.config.get('love-ide.additionalArgs');
	child_process.exec(`"${lovePath}" . ${additionalArgs}`, {cwd: dirs[0].getPath()}, (err, stdout, stderr) => {
		if(err) {
			var message = stderr.toString();
			if (err.code == 127) message = "LOVE executable not found. Try setting the PATH in the love-ide settings menu.";
			atom.notifications.addError('Error running LOVE.', {
				detail: message
			});
		}
	});
}

atom.commands.add('atom-text-editor', 'love-ide:run-love', run);

var toolBarSection = null;
export function consumeToolBar(toolBar: ToolBar) {
	logger.trace('Setting up toolbar.');

	toolBarSection = toolBar('love-ide');
	var runButton = toolBarSection.addButton({
		icon: 'play',
		tooltip: 'Run Love App',
		iconset: 'ion',
		callback: run,
	});
}

export function deactivate() {
	if (toolBarSection) {
		toolBarSection.removeItems();
	}
}
