//	Imports ____________________________________________________________________

import * as vscode from 'vscode';

import { invert, rotate } from './change-keyword';

//	Variables __________________________________________________________________



//	Initialize _________________________________________________________________



//	Exports ____________________________________________________________________

export function activate (context:vscode.ExtensionContext) {

	context.subscriptions.push(vscode.commands.registerCommand('l13Swap.invert', () => invert()));

	context.subscriptions.push(vscode.commands.registerCommand('l13Swap.rotate', () => rotate()));
	
}

export function deactivate () {
	
	//
	
}

//	Functions __________________________________________________________________

