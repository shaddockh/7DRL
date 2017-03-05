# 7DRL 2017

My entry for the 2017 7DRL is an attempt to create a more traditional roguelike.

__Technology and Art__
- Atomic Game Engine (http://atomicgameengine.com)
- TypeScript
- VSCode
- Atom
- TSLint
- ROT.js (http://ondras.github.io/rot.js/hp/)
- "Danc's Miraculously Flexible Game Prototyping Tiles" art by Daniel Cook (http://www.lostgarden.com/2007/05/dancs-miraculously-flexible-game.html)

__Ideas__
- [X] Basic dungeon generation, maybe using ROT
- [X] character graphics .. ascii tileset? -- using the Lost Garden tiles
- [X] blueprint library? yes.
- using some common movement components from prior roguelikes
- 2D
- Test using WebView for UI
- Melee only

- Be able to switch from Vi keys to Wasd keys?
- Try to focus on minimal keymap
- Pick up weapon auto equips if the weapon is better
- Potions?  should they auto-consume on pickup?

## Daily Log

### Day 0 - March 3, 2017
- Setting up the base project.
- Configuring the build process
- Set up the linter using TSLint and using the defaults from --init
- Configure VSCode to hide generated files, cache, etc.

### Day 1 - March 4, 2017
- Setting up the game structure and writing some utility classes
- Generating a simple roguelike style dungeon with ROT.js
- Rendering said dungeon with the game prototyping tiles from Lost Garden


