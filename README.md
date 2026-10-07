# Wrapper-TS

Wrap selected TypeScript code in common control-flow blocks with one command, with the indentation and formatting kept intact.

Select some code, open the Command Palette, and pick a wrapper. The block is built around your code and the cursor jumps to the parts you usually need to edit (conditions, loop variables, and so on).

## Features

- Wraps whole lines, so a selection that starts or ends mid-line still produces clean output.
- Works with no selection: the current line gets wrapped.
- Keeps the original relative indentation of your code and indents it one extra level inside the block.
- Respects your editor's tabs or spaces setting, and LF or CRLF line endings.
- Leaves blank lines empty (no trailing whitespace).
- Tab stops let you fill in the condition, value, or loop variable right after wrapping.

## Commands

Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) and type **Wrapper-TS**.

| Command | Wraps your selection in |
| --- | --- |
| Wrapper-TS: Wrap Selection in Try Catch | `try { … } catch (error) { … }` |
| Wrapper-TS: Wrap Selection in If Else | `if (…) { … } else { … }` |
| Wrapper-TS: Wrap Selection in If Else If | `if (…) { … } else if (…) { … } else { … }` |
| Wrapper-TS: Wrap Selection in Switch Case | `switch (…) { case …: … break; default: … }` |
| Wrapper-TS: Wrap Selection in For Loop | `for (let i = 0; i < …; i++) { … }` |
| Wrapper-TS: Wrap Selection in While Loop | `while (…) { … }` |
| Wrapper-TS: Wrap Selection in Do While Loop | `do { … } while (…);` |

## Example

Select these lines:

```ts
    const user = await getUser(id);
    console.log(user.name);
```

Run **Wrapper-TS: Wrap Selection in Try Catch**:

```ts
    try {
        const user = await getUser(id);
        console.log(user.name);
    } catch (error) {
        console.error(error);
    }
```

Nested code keeps its structure:

```ts
function run(items: string[]) {
    for (const item of items) {
        process(item);
    }
}
```

Select the `for` block and run **Wrap Selection in If Else**:

```ts
function run(items: string[]) {
    if (condition) {
        for (const item of items) {
            process(item);
        }
    } else {
        // TODO
    }
}
```

## Tips

- Press `Tab` after wrapping to move between the editable parts, and `Esc` to leave snippet mode.
- Want a shortcut? Add one in **Preferences: Open Keyboard Shortcuts (JSON)**:

```json
{
    "key": "ctrl+alt+t",
    "command": "wrapperTSSelection.tryCatch",
    "when": "editorTextFocus"
}
```

## Requirements

VS Code 1.107.0 or newer.

## Extension Settings

This extension does not add any settings. It follows your editor's indentation settings.

## Known Issues

- Only the primary selection is wrapped (multi-cursor is not supported yet).
- The extra indentation also applies to the contents of multi-line template strings inside the selection.

## Release Notes

### 0.0.1

- Initial release: try/catch, if/else, if/else if, switch/case, for, while, and do/while wrappers.

## License

MIT
