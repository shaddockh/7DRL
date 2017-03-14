# 7DRL 2017

## Post Competition Updates

There were a couple of game breaking bugs in the original competition release that this fixes
- null pointer error on null
- entities responding to other entities end of turn messages which was causing serious issues



## Competition

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

### Day 2 - March 5, 2017
- basic movement of player
- lots of work hooking into the event system
- rendering monsters
- very simplistic AI of monsters walking in a random way

### Day 3 - March 6, 2017
- start implementing bump/attack system
- code cleanup
- started thinking of ways to loosely couple attack/defend through events.  maybe by sending an attacker interface to a defender
  so the defender doesn't have to know the specific type of attack component.
- looked into using html for the ui with an embedded web view, but those don't look like they get deployed when you build, so that idea is out.  So basically, back to using TB for the ui.
- discovered that you need to periodically re-import assets after generating the prefabs since the cache gets out of sync.  This might be something the blueprint plugin should automatically do on generation.
- start adding configuration to the monster ai

### Day 4 - March 7, 2017
- work on attack mechanic
- player can kill creatures
- creatures also accidentally kill themselves, but hey, it's progress

### Day 5 - March 8, 2017
- work on events to notify actors when they attack or have been hit. or bumped.
- work on attack system to callback to the attacker to determine how much damage should be applied
- tuning the rendering of entities at different offsets within the grid cell
- added ability to generate multiple levels.  As the player moves through them, the player is persisted between the levels, but everything else is destroyed

### Day 6 - March 9, 2017
- added basic ui elements that show message log, player life, and current depth
- randomized # of monsters per level
- zoomed in the level and have camera follow player
- left to do:
  - have monsters actually chase and attack player
  - handle player death
  - implement the key to unlock the door to the next level
  - have the hearts increase health

### Day 7 - March 10, 2017
- intro instructions
- monsters follow and attack you if you get near
- doors are locked at level start
- getting a key unlocks the door
- hears increase health
- player can actually die
  
### Was it a success?
 Location - https://github.com/shaddockh/7DRL/tree/7DRL2017 
 Partial success. 
 
### Berlin Interpretation (http://www.roguebasin.com/index.php?title=Berlin_Interpretation) 
 - [x] Random Environment Generation 
 - [x] Permadeath 
 - [x] Turn Based 
 - [x] Grid Based 
 - [x] Non-Modal 
 - [ ] Complexity 
 - [ ] Resource Management 
 - [x] Hack n Slash 
 - [ ] Exploration and Discovery

### Fun? 
Not really.