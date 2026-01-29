# Origami Runtime

**A GameMaker Studio 1.4-inspired runtime for TypeScript web games**

The Origami Runtime provides a familiar GameObject-based programming model with GMS-style events, collision detection, input handling, and rendering for creating 2D games in the browser.

## Installation

```bash
npm install origami-runtime
```

## Quick Example

```typescript
import { GameObject, GameEngine } from 'origami-runtime';

// Define a game object
export class obj_player extends GameObject {
  create(): void {
    this.sprite_index = 'spr_player';
    this.x = 100;
    this.y = 100;
  }

  step(): void {
    // Movement
    if (keyboard_check(vk_right)) {
      this.x += 4;
    }
    if (keyboard_check(vk_left)) {
      this.x -= 4;
    }

    // Jump
    if (keyboard_check_pressed(vk_space)) {
      this.vspeed = -10;
    }

    // Gravity
    this.vspeed += 0.5;
  }

  draw(): void {
    draw_self.call(this);
  }
}

// Initialize engine
const engine = new GameEngine({
  canvas: document.getElementById('game-canvas') as HTMLCanvasElement,
  width: 640,
  height: 480,
  backgroundColor: '#000000',
  startRoom: 'room_start'
});

// Register objects
engine.registerObject('obj_player', obj_player);

// Start game
await engine.start();
```

## Features

- **GMS-Style Events** - `create()`, `step()`, `draw()`, `roomStart()`, `roomEnd()`
- **Automatic Motion** - `speed`, `direction`, `hspeed`, `vspeed` auto-update
- **Sprite Animation** - Automatic frame advancement with `image_speed`
- **Collision Detection** - AABB collision with `place_meeting()`, `instance_place()`
- **Input Handling** - Keyboard and mouse with GMS constants (`vk_space`, `mb_left`)
- **Drawing API** - `draw_sprite()`, `draw_text()`, `draw_rectangle()`, etc.
- **Room System** - JSON-based rooms with instances and views
- **Camera System** - View following with deadzone/border
- **Debug Tools** - Built-in FPS counter and collision visualization (F3 key)
- **TypeScript** - Full type safety with strict mode

## Core API

### GameObject Class

All game objects extend `GameObject`:

```typescript
export class obj_enemy extends GameObject {
  private health: number = 100;

  create(): void {
    this.sprite_index = 'spr_enemy';
    this.speed = 2;
    this.direction = 180;
  }

  step(): void {
    // AI logic here
    if (place_meeting.call(this, this.x + this.hspeed, this.y, 'obj_wall')) {
      this.direction = 360 - this.direction; // Turn around
    }
  }
}
```

### Global Functions

Familiar GMS-style global functions:

```typescript
// Instance management
const bullet = await instance_create(this.x, this.y, 'obj_bullet');
instance_destroy.call(this);
const exists = instance_exists('obj_player');

// Collision
const colliding = place_meeting.call(this, this.x + 1, this.y, 'obj_wall');
const coin = instance_place.call(this, this.x, this.y, 'obj_coin');

// Input
if (keyboard_check(vk_w)) { /* move up */ }
if (mouse_check_button_pressed(mb_left)) { /* shoot */ }

// Drawing (in draw event)
draw_sprite('spr_bullet', 0, this.x, this.y);
draw_text(10, 10, 'Score: 100');
draw_set_color('#FF0000');
draw_rectangle(x1, y1, x2, y2, false);

// Math & motion
const angle = point_direction(x1, y1, x2, y2);
const dist = point_distance(x1, y1, x2, y2);
this.hspeed = lengthdir_x(speed, direction);
this.vspeed = lengthdir_y(speed, direction);

// Random
const value = random(100);
const int = irandom(10);
```

## Built-in Properties

Every GameObject has these properties:

```typescript
// Position
x, y, xprevious, yprevious, xstart, ystart

// Motion
speed, direction, hspeed, vspeed

// Sprite & Animation
sprite_index, image_index, image_speed
image_alpha, image_angle, image_xscale, image_yscale

// Other
visible, depth, order, persistent
```

## Documentation

For complete API reference with all functions, events, and examples:

**[📖 Full Documentation](DOCUMENTATION.md)**

The documentation follows GameMaker Studio 1.4 format with:
- Complete function reference organized by category
- Syntax, parameters, and return values for every function
- Code examples
- Constants reference (all `vk_*` and `mb_*` constants)
- Global variables reference

## TypeScript Support

Origami Runtime is built with TypeScript and includes full type definitions:

```typescript
import { GameObject, GameEngine, GameConfig } from 'origami-runtime';
import type { Sprite, RoomDefinition, ViewConfig } from 'origami-runtime';
```

Use strict mode for best results:
```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2020",
    "module": "ES2020"
  }
}
```

## Project Structure

```
your-game/
├── objects/
│   ├── obj_player.ts
│   └── obj_enemy.ts
├── sprites/
│   └── spr_player/
│       ├── metadata.json
│       └── frame_0.png
├── rooms/
│   └── room_level1.json
└── src/
    └── main.ts
```

## License

MIT

## Links

- [Origami Engine Repository](https://github.com/yourusername/origami-engine)
- [Full Documentation](DOCUMENTATION.md)
- [CLI Tool](../cli/)
- [Example Games](../../platformer/)
