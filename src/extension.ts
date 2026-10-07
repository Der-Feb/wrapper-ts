import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Wrapper-TS extension is active!');

    // Register the command matching package.json
    let disposable = vscode.commands.registerCommand('wrapperTSSelection.tryCatch', async () => {
        // 1. Get active text editor
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showWarningMessage('No active editor found.');
            return;
        }

        const document = editor.document;
        const selection = editor.selection;

        // 2. Get selected text (or current line if nothing selected)
        let selectedText = document.getText(selection);

        if (!selectedText) {
            vscode.window.showInformationMessage('Please select some code to wrap in try-catch.');
            return;
        }

        // 3. Indent the selected text so it aligns inside the try block
        const tabSize = Number(editor.options.tabSize) || 4;
        const insertSpaces = editor.options.insertSpaces ?? true;
        const indentStr = insertSpaces ? ' '.repeat(tabSize) : '\t';

        const indentedText = selectedText
            .split('\n')
            .map(line => `${indentStr}${line}`)
            .join('\n');

        // 4. Build wrapped snippet
        const wrappedSnippet = `try {\n${indentedText}\n} catch (error) {\n${indentStr}console.error(error);\n}`;

        // 5. Replace selection in editor
        await editor.edit(editBuilder => {
            editBuilder.replace(selection, wrappedSnippet);
        });
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}