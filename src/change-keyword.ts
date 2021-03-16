//	Imports ____________________________________________________________________

import { readFileSync } from 'fs';
import { join } from 'path';

import * as vscode from 'vscode';
import { SimpleMap } from './types';

//	Variables __________________________________________________________________

const inverters = {
	javascript: createKeywordMap('./inverters/javascript.json'),
	javascriptreact: createKeywordMap('./inverters/javascript.json'),
	json: createKeywordMap('./inverters/json.json'),
	jsonc: createKeywordMap('./inverters/json.json'),
	shellscript: createKeywordMap('./inverters/shellscript.json'),
	typescript: createKeywordMap('./inverters/javascript.json', './inverters/typescript.json'),
	typescriptreact: createKeywordMap('./inverters/javascript.json', './inverters/typescript.json'),
};

const rotators = {
	javascript: createKeywordMap('./rotators/javascript.json'),
	javascriptreact: createKeywordMap('./rotators/javascript.json'),
	json: createKeywordMap('./rotators/json.json'),
	jsonc: createKeywordMap('./rotators/json.json'),
	shellscript: createKeywordMap('./inverters/shellscript.json'),
	typescript: createKeywordMap('./rotators/javascript.json', './rotators/typescript.json'),
	typescriptreact: createKeywordMap('./rotators/javascript.json', './rotators/typescript.json'),
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
 * @param pathname The path of the JSON file for the keaywords list.
 * @returns A map with name value pairs for each keyword.
 */

function createKeywordMap (...pathnames:string[]) :SimpleMap {
	
	const keywords:SimpleMap = {};
	
	pathnames.forEach((pathname) => {
		
		const lists:string[][] = JSON.parse(readFileSync(join(__dirname, pathname), 'utf-8'));
		
		lists.forEach((pair) => {
			
			pair.forEach((value, index) => keywords[value] = pair[index + 1] || pair[0]);
			
		});
		
	});
	
	return keywords;
	
}

/**
 * Replaces a selection if a keyword is aprt of a map.
 * @param keywords A map with keywords
 */

function changeKeyword (keywords:{ [languageId:string]:SimpleMap }) {
	
	const activeTextEditor = vscode.window.activeTextEditor;
	
	if (!activeTextEditor) return;
	
	const document = activeTextEditor.document;
	const languageKeywords = keywords[document.languageId];
	
	if (!languageKeywords) return;
	
	let selections = activeTextEditor.selections;
	const empties:boolean[] = [];
	
	if (!selections.length) return;
	
	selections = sortSelections(document, selections);
	
	activeTextEditor.edit((editBuilder:vscode.TextEditorEdit) => {
		
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
		
			if (nextKeyword)  editBuilder.replace(range, nextKeyword);
			
		});
		
	}).then(() => {
		
		let newSelections = activeTextEditor.selections;
	
		newSelections = sortSelections(document, newSelections);
		
		activeTextEditor.selections = newSelections.map((selection, index) => {
		
			return empties[index] ? new vscode.Selection(selection.end, selection.end) : selection;
			
		});
		
	});
	
}

/**
 * Sorts an array of selections by the start offset.
 * @param document The active document in the editor.
 * @param selections An array with selections.
 * @returns Returns a sorted array with selections by position.
 */

function sortSelections (document:vscode.TextDocument, selections:vscode.Selection[]) {
	
	return selections.sort((selectionA, selectionB) => {
		
		const offsetA = document.offsetAt(selectionA.start);
		const offsetB = document.offsetAt(selectionB.start);
		
		return -(offsetA < offsetB) || +(offsetA > offsetB) || 0;
		
	});
	
}