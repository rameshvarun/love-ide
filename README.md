# love-ide
Utilities for writing Love2D games in Atom.

## Features
### Run Icon in Toolbar
![](https://raw.githubusercontent.com/rameshvarun/love-ide/master/demo/run.png)

### Autocomplete
![](https://raw.githubusercontent.com/rameshvarun/love-ide/master/demo/autocomplete.png)
Autocompletes snippets for calling methods and defining callbacks. Provides descriptions, as well as links to the wiki page.

### Auto-Install
This package automatically installs the following packages, which provide additional features:
  - [tool-bar](https://atom.io/packages/tool-bar)
  - [language-lua](https://atom.io/packages/language-lua)
  - [linter](https://atom.io/packages/linter)
  - [hyperclick](https://atom.io/packages/hyperclick)
  - [nuclide-quick-open](https://atom.io/packages/nuclide-quick-open)
  - [language-glsl](https://atom.io/packages/language-glsl)
  - [autocomplete-glsl](https://atom.io/packages/autocomplete-glsl)

## Contributing
```bash
# Clone the repo recursively, and cd in.
git clone --recursive https://github.com/rameshvarun/love-ide.git
cd love-ide

# Install all the dependencies.
npm install

# Symlink the package into ~/.atom/packages.
apm link
```

## TODO
- Jump-to-definition (via Hyperclick).
- Run Love Command.
- Hooks for various optional packages.
- Get Lua linting working.
- Some sort of Debug system?
