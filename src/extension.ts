import * as vscode from 'vscode';

interface WrapTemplate {
    /** How many indent levels the selected code is pushed in. */
    depth: number;
    /** Lines placed before the code. A leading \t means one indent level. Snippet syntax is allowed. */
    head: string[];
    /** Lines placed after the code. */
    tail: string[];
}

const TEMPLATES: Record<string, WrapTemplate> = {
    'wrapperTSSelection.tryCatch': {
        depth: 1,
        head: ['try {'],
        tail: ['} catch (error) {', '\t${1:console.error(error);}', '}'],
    },
    'wrapperTSSelection.ifElse': {
        depth: 1,
        head: ['if (${1:condition}) {'],
        tail: ['} else {', '\t${2:// TODO}', '}'],
    },
    'wrapperTSSelection.ifElseIf': {
        depth: 1,
        head: ['if (${1:condition}) {'],
        tail: [
            '} else if (${2:condition}) {',
            '\t${3:// TODO}',
            '} else {',
            '\t${4:// TODO}',
            '}',
        ],
    },
    'wrapperTSSelection.switchCase': {
        depth: 2,
        head: ['switch (${1:expression}) {', '\tcase ${2:value}:'],
        tail: ['\t\tbreak;', '\tdefault:', '\t\t${3:// TODO}', '}'],
    },
    'wrapperTSSelection.forLoop': {
        depth: 1,
        head: ['for (let ${1:i} = 0; $1 < ${2:length}; $1++) {'],
        tail: ['}'],
    },
    'wrapperTSSelection.whileLoop': {
        depth: 1,
        head: ['while (${1:condition}) {'],
        tail: ['}'],
    },
    'wrapperTSSelection.doWhileLoop': {
        depth: 1,
        head: ['do {'],
        tail: ['} while (${1:condition});'],
    },
};

const leadingWhitespace = (line: string): string => /^[ \t]*/.exec(line)![0];

/** Escape characters that have special meaning inside VS Code snippets. */
const escapeSnippet = (text: string): string => text.replace(/[\\$}]/g, '\\$&');

async function wrapSelection(template: WrapTemplate): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showWarningMessage('No active editor found.');
        return;
    }

    const { document, selection } = editor;

    // Work on whole lines. If the selection ends at column 0 of a line,
    // that last line isn't really part of the selection.
    const startLine = selection.start.line;
    let endLine = selection.end.line;
    if (!selection.isEmpty && endLine > startLine && selection.end.character === 0) {
        endLine--;
    }

    const lines: string[] = [];
    for (let i = startLine; i <= endLine; i++) {
        lines.push(document.lineAt(i).text);
    }

    const nonEmpty = lines.filter(line => line.trim() !== '');
    if (nonEmpty.length === 0) {
        vscode.window.showInformationMessage(
            'Select some code (or put the cursor on a line of code) to wrap.'
        );
        return;
    }

    // One indent level, matching the editor's settings.
    const { tabSize, insertSpaces } = editor.options;
    const unit = insertSpaces === false ? '\t' : ' '.repeat(Number(tabSize) || 4);

    // Wrapper lines line up with the least-indented selected line.
    const baseIndent = nonEmpty
        .map(leadingWhitespace)
        .reduce((a, b) => (b.length < a.length ? b : a));

    const formatWrapperLine = (line: string): string =>
        baseIndent + line.replace(/^\t+/, tabs => unit.repeat(tabs.length));

    // Selected code keeps its original indentation, plus the extra levels.
    const inner = unit.repeat(template.depth);
    const body = lines.map(line =>
        line.trim() === '' ? '' : escapeSnippet(inner + line)
    );

    const snippetText = [
        ...template.head.map(formatWrapperLine),
        ...body,
        ...template.tail.map(formatWrapperLine),
    ].join('\n');

    // Replace from column 0 so the snippet engine doesn't add extra indentation.
    const range = new vscode.Range(
        startLine,
        0,
        endLine,
        document.lineAt(endLine).text.length
    );

    await editor.insertSnippet(new vscode.SnippetString(snippetText), range);
}

export function activate(context: vscode.ExtensionContext) {
    console.log('Wrapper-TS extension is active!');

    for (const [command, template] of Object.entries(TEMPLATES)) {
        context.subscriptions.push(
            vscode.commands.registerCommand(command, () => wrapSelection(template))
        );
    }
}

export function deactivate() {}