//	Imports ____________________________________________________________________

import * as vscode from 'vscode';

import { default as invertJavaScript } from './inverters/javascript';
import { default as invertJSON } from './inverters/json';
import { default as invertShellScript } from './inverters/shellscript';
import { default as invertTypeScript } from './inverters/typescript';

import { default as rotateJavaScript } from './rotators/javascript';
import { default as rotateJSON } from './rotators/json';
import { default as rotateShellScript } from './rotators/shellscript';
import { default as rotateTypeScript } from './rotators/typescript';

import type { Dictionary } from './@types/basics';

//	Variables __________________________________________________________________

const inverters = {
	html: createKeywordMap(invertJavaScript),
	javascript: createKeywordMap(invertJavaScript),
	javascriptreact: createKeywordMap(invertJavaScript),
	json: createKeywordMap(invertJSON),
	jsonc: createKeywordMap(invertJSON),
	shellscript: createKeywordMap(invertShellScript),
	typescript: createKeywordMap(invertJavaScript, invertTypeScript),
	typescriptreact: createKeywordMap(invertJavaScript, invertTypeScript),
};

const rotators = {
	html: createKeywordMap(rotateJavaScript),
	javascript: createKeywordMap(rotateJavaScript),
	javascriptreact: createKeywordMap(rotateJavaScript),
	json: createKeywordMap(rotateJSON),
	jsonc: createKeywordMap(rotateJSON),
	shellscript: createKeywordMap(rotateShellScript),
	typescript: createKeywordMap(rotateJavaScript, rotateTypeScript),
	typescriptreact: createKeywordMap(rotateJavaScript, rotateTypeScript),
};

//	Initialize _________________________________________________________________



//	Exports ____________________________________________________________________

export function invert () {
	
	changeKeyword(inverters);
	
}

export function rotate () {
	
	changeKeyword(rotators);
	
}

//	Functions __________________________________________________________________

/**
 * Loads a JSON file and creates a map with name value pairs for each keyword.
 *
 * @param pathname The path of the JSON file for the keaywords list.
 * @returns A map with name value pairs for each keyword.
 */

function createKeywordMap (...keywords: string[][][]) {
	
	const result: Dictionary<string> = {};
	
	keywords.forEach((lists) => {
		
		lists.forEach((pair) => {
			
			pair.forEach((value, index) => result[value] = pair[index + 1] || pair[0]);
			
		});
		
	});
		
	return result;
	
}

/**
 * Replaces a selection if a keyword is aprt of a map.
 *
 * @param keywords A map with keywords
 */

function changeKeyword (keywords: Dictionary<Dictionary<string>>) {
	
	const activeTextEditor = vscode.window.activeTextEditor;
	
	if (!activeTextEditor) return;
	
	const document = activeTextEditor.document;
	const languageKeywords = keywords[document.languageId];
	
	if (!languageKeywords) return;
	
	let selections = [...activeTextEditor.selections];
	const empties: boolean[] = [];
	
	if (!selections.length) return;
	
	selections = sortSelections(document, selections);
	
	activeTextEditor.edit((editBuilder: vscode.TextEditorEdit) => {
		
		selections.forEach((selection) => {

			let range = null;
		
			if (selection.isEmpty) {
				empties.push(true);
				range = document.getWordRangeAtPosition(selection.start);
				if (!range) return;
			} else {
				empties.push(false);
				range = selection.with();
			}
		
			const nextKeyword = languageKeywords[document.getText(range)];
		
			if (nextKeyword) editBuilder.replace(range, nextKeyword);
			
		});
		
	}).then(() => {
		
		let newSelections = [...activeTextEditor.selections];
	
		newSelections = sortSelections(document, newSelections);
		
		activeTextEditor.selections = newSelections.map((selection, index) => {
		
			return empties[index] ? new vscode.Selection(selection.end, selection.end) : selection;
			
		});
		
	});
	
}

/**
 * Sorts an array of selections by the start offset.
 *
 * @param document The active document in the editor.
 * @param selections An array with selections.
 * @returns Returns a sorted array with selections by position.
 */

function sortSelections (document: vscode.TextDocument, selections: vscode.Selection[]) {
	
	return selections.sort((selectionA, selectionB) => {
		
		const offsetA = document.offsetAt(selectionA.start);
		const offsetB = document.offsetAt(selectionB.start);
		
		return -(offsetA < offsetB) || +(offsetA > offsetB) || 0;
		
	});
	
}