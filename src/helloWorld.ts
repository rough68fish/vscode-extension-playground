import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class HelloWorldViewProvider implements vscode.WebviewViewProvider {
	public static readonly viewType = "helloworld.helloworldView";
  
	constructor(private readonly extensionUri: vscode.Uri) {}
  
	public resolveWebviewView(
	  webviewView: vscode.WebviewView,
	  context: vscode.WebviewViewResolveContext,
	  _token: vscode.CancellationToken
	) {
	  webviewView.webview.options = {
		enableScripts: true,
		localResourceRoots: [this.extensionUri]
	  };
  
	  this.updateWebviewContent(webviewView);
	}
  
	private updateWebviewContent(webviewView: vscode.WebviewView) {
		const config = vscode.workspace.getConfiguration('helloworld');
		const requirementsDirectory = config.get<string>('requirementsDirectory', './docs/requirements');
		const workspaceFolders = vscode.workspace.workspaceFolders;
	
		if (!workspaceFolders) {
		  webviewView.webview.html = this.getHtmlForWebview([], 'No workspace is currently open.');
		  return;
		}
	
		const workspacePath = workspaceFolders[0].uri.fsPath;
		const requirementsPath = path.join(workspacePath, requirementsDirectory);
	
		if (fs.existsSync(requirementsPath)) {
		  fs.readdir(requirementsPath, (err, files) => {
			if (err) {
			  webviewView.webview.html = this.getHtmlForWebview([], `Error reading directory: ${err.message}`);
			  return;
			}
			webviewView.webview.html = this.getHtmlForWebview(files);
		  });
		} else {
		  webviewView.webview.html = this.getHtmlForWebview([], `Requirements Directory '${requirementsDirectory}' not found.`);
		}
	}

	private getHtmlForWebview(files: string[], errorMessage: string = ''): string {
		const fileList = files.map(file => `<li>${file}</li>`).join('');
		const errorHtml = errorMessage ? `<p style="color: red;">${errorMessage}</p>` : '';
	
		return `<!DOCTYPE html>
		  <html lang="en">
		  <head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Hello World</title>
		  </head>
		  <body>
			<h1>Hello World View</h1>
			${errorHtml}
			<ul>
			  ${fileList}
			</ul>
		  </body>
		  </html>`;
	}
}
