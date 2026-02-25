# TODO

## Refactor / Generalize

- [ ] **Level bootstrap** - centralize register_world + input.init + background setup into a shared init function instead of copy-pasting it in every page
  - shared init that takes a world div, width, height and does all the boilerplate
  - background / foreground layer creation as part of that init
  - automatically call input.init so individual pages don't have to

- [ ] **Collectable system** - pull the pickup detection + save_collectable calls out of s2_EXT.js and s5.js into a reusable module
  - generic overlap check between player and collectable obj
  - hook into save_collectable / check_collectable for persistence
  - visual feedback on pickup (hide the item, maybe a little effect later)

- [ ] **Spawn point selection** - shared helper for "pick spawn based on last level" (duplicated across s2, s3, s4, s5)

- [ ] **Animation sequencer** - generic timer/tween system to replace the manual frame-counter state machines in s1.js (intro) and start.js (wobble, jitter, shake)
  - core timeline that ticks with the game loop
  - ability to queue steps (wait, tween a value, call a function)
  - replace the s1.js intro sequence and start.js wobble/jitter with it

- [ ] **Scene transitions** - abstract the fade-out + window.location.href navigation pattern into a reusable function

- [ ] **UI buttons / menus** - generalize the hover/click/jitter logic from start.js so menus aren't one-off code
  - hover state detection (mouse enter/leave on scaled world coordinates)
  - click handler with optional animation (jitter, shake, etc.)
  - reusable for any future menu or in-game prompt

- [ ] **Fix check_collectable bug** - system.ts:190 uses === undefined when it should check for the key existing and being true

## Engine Improvements

- [ ] **Camera system** - s1.js has a manual camera follow; turn that into a proper reusable camera in system.ts
  - follow a target obj with smooth lerp
  - optional bounds so it doesn't scroll past level edges
  - offset support for look-ahead or cutscene framing

- [ ] **State machine** - utility for level phases (intro -> gameplay -> outro) so levels don't need hand-rolled timer logic
  - define named states with enter/update/exit callbacks
  - simple transition API (go to state X)
  - each level just declares its states instead of writing a big if/else chain

- [ ] **Particle system** - flesh out the particle class stub in system.ts
  - see Planned Features > Particle System below

## Planned Features

- [ ] **Audio** - music + sound effects, integrate with the asset caching pipeline
  - audio manager that preloads files alongside images
  - play / stop / loop API for music tracks
  - one-shot play for sound effects (jump, land, pickup, etc.)

- [ ] **Enemies / hazards** - moving entities, damage, death + respawn loop
  - base enemy class extending obj with simple AI (patrol, chase, etc.)
  - damage / hit detection against the player
  - player death state and respawn at last checkpoint or level start

- [ ] **More worlds** - expand beyond world0

- [ ] **Cutscenes / dialogue** - story sequences between levels
  - trigger system (enter a zone, finish a level, etc.)
  - text rendering with typewriter effect
  - sequencer to chain dialogue lines, pauses, and camera moves

- [ ] **Animation System** - some sort of animation system that hooks with the game loop to "play" pre recorded animation loops
  - define keyframes as a list of sprite classes or transforms over time
  - play / pause / loop controls
  - attach to any obj so it swaps sprites or tweens properties each frame

- [ ] **Particle System** - some sort of particle system that allows for easy creation and use of little particle effects
  - emitter that spawns particles with randomized velocity, lifetime, size
  - built-in behaviors (fade out, shrink, gravity)
  - easy one-liner API like particles.burst(x, y, count) for dust, sparks, etc.
