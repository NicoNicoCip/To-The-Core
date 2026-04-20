# TODO

## Refactor / Generalize

- [x] **Level bootstrap** - boil_the_plate() covers register_world + input.init. Per-scene layer calls intentionally left flexible (see make_layers discussion).

- [x] **Spawn point selection** - come_from() already is the helper. Remaining per-scene routing is intentionally explicit.

- [ ] **Collectable pickup visuals** - the collectable system itself is done (Scene.collectable + _check_collectables in system.ts handle everything), but pickups currently just vanish. Add some form of visual feedback on pickup - particle burst, flash, fade-out, etc.

- [x] **Animation sequencer** - Sequencer in prefabs.ts handles wait/call/tween/wait_until. Applied to s1.js intro and s0.js. start.js kept as-is (its frame-counter form was already compact).

- [x] **Scene transitions** - send_to() already covers navigation. Fade infrastructure localized to s0.html/start.html (the only places that fade); unused #fade CSS removed from world1.css.

- [x] **UI buttons / menus** - Button class added to prefabs.ts (hover_class toggle + on_click + disable). Migrated play_sign in start.js.

## Engine Improvements

- [ ] **State machine** - a proper named-state utility for level phases (intro -> gameplay -> outro). The current hand-rolled timer/flag approach works but a real state machine would be cleaner and pair well with the animation system below
  - define named states with enter/update/exit callbacks
  - simple transition API (go to state X)
  - each level just declares its states instead of writing a big if/else chain

- [ ] **Animation system** - play pre-recorded animation loops on any obj, hooked into the game loop. Would replace hard-coded intro sequences (e.g. s0)
  - define keyframes as a list of sprite classes or transforms over time
  - play / pause / loop controls
  - attach to any obj so it swaps sprites or tweens properties each frame

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

- [ ] **More worlds** - expand beyond world0 (in progress)

- [ ] **Cutscenes / dialogue** - story sequences between levels
  - trigger system (enter a zone, finish a level, etc.)
  - text rendering with typewriter effect
  - sequencer to chain dialogue lines, pauses, and camera moves

- [ ] **Particle System** - some sort of particle system that allows for easy creation and use of little particle effects
  - emitter that spawns particles with randomized velocity, lifetime, size
  - built-in behaviors (fade out, shrink, gravity)
  - easy one-liner API like particles.burst(x, y, count) for dust, sparks, etc.
