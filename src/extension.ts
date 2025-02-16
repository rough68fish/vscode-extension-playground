// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { HelloWorldViewProvider } from './helloWorld';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "helloworld" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('helloworld.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello VS Code!');
	});

	context.subscriptions.push(disposable);

	const checkRequirementsDisposable = vscode.commands.registerCommand('helloworld.checkRequirements', async () => {
		const config = vscode.workspace.getConfiguration('helloworld');
		const requirementsDirectory = config.get<string>('requirementsDirectory', './docs/requirements');
		const workspaceFolders = vscode.workspace.workspaceFolders;
	
		if (!workspaceFolders) {
		  vscode.window.showErrorMessage('No workspace is currently open.');
		  return;
		}
	
		const workspacePath = workspaceFolders[0].uri.fsPath;
		const requirementsPath = path.join(workspacePath, requirementsDirectory);
	
		if (fs.existsSync(requirementsPath)) {
		  fs.readdir(requirementsPath, (err, files) => {
			if (err) {
			  vscode.window.showErrorMessage(`Error reading directory: ${err.message}`);
			  return;
			}
			vscode.window.showInformationMessage(`Requirements Directory found with ${files.length} files.`);
		  });
		} else {
		  vscode.window.showErrorMessage(`Requirements Directory '${requirementsDirectory}' not found.`);
		}
	});
	
	context.subscriptions.push(checkRequirementsDisposable);

	const helloworldViewProvider = new HelloWorldViewProvider(context.extensionUri);
	vscode.window.registerWebviewViewProvider('helloworldView', helloworldViewProvider)

	  
	
}


// This method is called when your extension is deactivated
export function deactivate() {}
