# L13 Swap

Invert or rotate keywords in JavaScript and TypeScript.

This extension is part of the [L13 Extension Pack](https://marketplace.visualstudio.com/items?itemName=L13RARY.l13-extension-pack).

## What's new in L13 Swap 0.14.0

- Added support for JSON and JSONC.
- Added support for JavaScript React and TypeScript React.

## Features

* Select a keyword and change it to its opposite e.g. like a boolean from `true` to `false` or vice versa.
* Select a keyword and change it to its next sibling e.g. like an accessor from `private` -> `protected` -> `public` -> `private` ... The rotation is always in alphabetical order.

## Available Commands

* `Invert Keyword` - Invert a keyword to its opposite.
* `Rotate Keyword` - Rotate a keyword to its next sibling.

## Keyboard Shortcuts

### macOS

* `Cmd + I` -> Invert Keyword
* `Cmd + Shift + I` -> Rotate Keyword

### Windows / Linux

* `Ctrl + I` -> Invert Keyword
* `Ctrl + Shift + I` -> Rotate Keyword

If the key bindings don't work, please check `Preferences -> Keyboard Shortcuts`.