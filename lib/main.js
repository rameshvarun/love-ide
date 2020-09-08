'use babel';
/* @flow */

import child_process from 'child_process';
import fs from 'fs';
import path from 'path';

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
	},
	terminalEmulator: {
		title: 'Run In Terminal Emulator',
		description: `When running your Love game, create a terminal emulator
		window, and show the output to that window.`,
		type: 'string',
		default: 'None',
		enum: ['None', 'CMD (Windows)', 'iTerm2', 'uxterm (Linux)', 'Gnome terminal'],
		order: 3,
	},
	disableToolbarButton: {
		title: 'Disable Toolbar Buttons',
		description: `Don't show a run and a build icon in the toolbar.`,
		type: 'boolean',
		default: false,
		order: 4,
	}
}

export function activate () {
	require('atom-package-deps').install('love-ide');
}

function buildapp() {
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

	// Get package directory
	var startpath = atom.packages.getPackageDirPaths()[0] + "\\love-ide\\lib";
	for (var lipath of atom.packages.getPackageDirPaths()) {
		if (fs.existsSync(lipath + "\\love-ide\\lib")) {
			startpath = lipath + "\\love-ide\\lib";
		}
	}

	// Check OS
	var command = "zip -9 -r compressed.love .";
	if (process.platform == "win32") {
		command = `start cmd.exe @cmd /c "start build-love.bat ${dirs[0].getPath()} ${lovePath} && exit"`;
	}
	else {
		startpath = dirs[0].getPath();
	}

	// Run commands
	child_process.exec(command, {cwd: startpath}, (err, stdout, stderr) => {
		if(err) {
			var message = stderr.toString();
			if (err.code == 127) message = "LOVE executable not found. Try setting the PATH in the love-ide settings menu.";
			atom.notifications.addError('Error running LOVE.', {
				detail: message
			});
		}
	});
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
	var terminalEmulator = atom.config.get('love-ide.terminalEmulator');

	var command = `"${lovePath}" . ${additionalArgs}`;
	switch (terminalEmulator) {
		case 'None':
			child_process.exec(command, {cwd: dirs[0].getPath()}, (err, stdout, stderr) => {
				if(err) {
					var message = stderr.toString();
					if (err.code == 127) message = "LOVE executable not found. Try setting the PATH in the love-ide settings menu.";
					atom.notifications.addError('Error running LOVE.', {
						detail: message
					});
				}
			});
			break;
		case 'CMD (Windows)':
			child_process.exec(`start cmd.exe @cmd /c "${command}"`, {cwd: dirs[0].getPath()}, (err, stdout, stderr) => {
				if(err) {
					var message = stderr.toString();
					if (err.code == 127) message = "LOVE executable not found. Try setting the PATH in the love-ide settings menu.";
					atom.notifications.addError('Error running LOVE.', {
						detail: message
					});
				}
			});
			break;
		case 'iTerm2':
			var child = child_process.exec('osascript', {cwd: dirs[0].getPath()}, (err, stdout, stderr) => {
				if(err) {
					var message = stderr.toString();
					if (err.code == 127) message = "LOVE executable not found. Try setting the PATH in the love-ide settings menu.";
					atom.notifications.addError('Error running LOVE.', {
						detail: message
					});
				}
			});
			var escape = (c) => c.replace(/\\/g, `\\\\`).replace(/\"/g, `\\\"`);
			var command = `cd "${dirs[0].getPath()}" && ` + command;
			var shell_command = `/bin/sh -c "${escape(command)}"`;

			var apple_script = `tell application "iTerm2"
  			create window with default profile command "${escape(shell_command)}"
			end tell`;
			child.stdin.write(apple_script);
			child.stdin.end();
			break;
		case 'uxterm (Linux)':
			child_process.exec(`uxterm -e "${command}"`, {cwd: dirs[0].getPath()}, (err, stdout, stderr) => {
				if(err) {
					var message = stderr.toString();
					atom.notifications.addError('Error running uxterm.', {
						detail: message
					});
				}
			});
			break;
		case 'Gnome terminal':
			child_process.exec(`gnome-terminal -x sh -c "${command}"`, {cwd: dirs[0].getPath()}, (err, stdout, stderr) => {
				if(err) {
					var message = stderr.toString();
					atom.notifications.addError('Error running Gnome terminal.', {
						detail: message
					});
				}
			});
			break;
		default:
			atom.notifications.addError(`Unsupported terminal emulator ${terminalEmulator}.`);
	}
}

atom.commands.add('atom-text-editor', 'love-ide:run-love', run);
atom.commands.add('atom-text-editor', 'love-ide:compile-love', buildapp);

var toolBarSection = null;
export function consumeToolBar(toolBar: ToolBar) {
	if (atom.config.get('love-ide.disableToolbarButton')) return;

	toolBarSection = toolBar('love-ide');
	var runButton = toolBarSection.addButton({
		icon: 'ios-play',
		tooltip: 'Run Love App',
		iconset: 'ion',
		callback: run,
	});

	var buildTooltip = 'Create a .love-file';
	if (process.platform == "win32") { buildTooltip = 'Build Love Windows Executable'; }

	var buildButton = toolBarSection.addButton({
		icon: 'ios-hammer',
		tooltip: buildTooltip,
		iconset: 'ion',
		callback: buildapp,
	});
}

export function deactivate() {
	if (toolBarSection) {
		toolBarSection.removeItems();
	}
}
