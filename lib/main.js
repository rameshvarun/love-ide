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
		order: 2,
	}
}

export function activate () {
	install();
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
					var message = stderr.toString();
					if (err.code == 127) message = "LOVE executable not found. Try setting the PATH in the love-ide settings menu.";
					atom.notifications.addError('Error running LOVE.', {
						detail: message
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
