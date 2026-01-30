# Origami Engine

**A GameMaker Studio 1.4-inspired game engine for TypeScript and the web**

Build 2D platformers and games with familiar GameObject-based APIs, running natively in modern browsers with full TypeScript support.

---

## 🚀 Quick Start

### Create Your Game

```bash
# 1. Clone this repo as your game project
git clone https://github.com/NicoNicoCip/Origami-Engine my-awesome-game
cd my-awesome-game

# 2. Run the installer
node .origami/init-game.js
```

That's it! The installer will:
- ✅ Fetch the engine into `.origami/` folder
- ✅ Let you choose a template (fresh or platformer)
- ✅ Set up your game files at root level
- ✅ Configure git and .gitignore
- ✅ Ready to develop immediately!

### After Installation

Your project structure will look like:

```
my-awesome-game/
├── .origami/           # Engine (hidden, git-ignored)
│   ├── packages/       # Runtime + CLI
│   ├── docs/           # Documentation
│   └── ...
├── objects/            # Your game objects
│   ├── obj_player.ts
│   └── ...
├── sprites/            # Your sprites
│   └── spr_player/
├── rooms/              # Your levels
│   └── room_level1.json
├── src/                # Entry point
│   └── main.ts
├── game.json           # Game configuration
├── index.html          # Play your game here!
└── README.md           # Your game's README
```

**Just open `index.html` in your browser and start coding!**

---

## 🎮 Features

- **Familiar GMS-style API** - GameObject classes with `create()`, `step()`, `draw()` events
- **TypeScript First** - Full type safety with strict mode support
- **Browser Native** - Runs in any modern browser using Canvas 2D
- **Easy to Learn** - Similar to GameMaker Studio 1.4.9999
- **Self-Contained** - Engine lives in `.origami/` folder, no global installation
- **Debug Tools** - Built-in FPS counter, collision visualization (press F3)
- **Templates** - Start with empty project or working platformer example

---

## 📚 Documentation

After installing, check the documentation in `.origami/docs/`:

- **Quick Start** - `.origami/docs/md/02-quick-start.md` - Your first game in 5 minutes
- **GameObject System** - `.origami/docs/md/04-gameobjects.md` - Core game object concepts
- **API Reference** - `.origami/docs/md/20-api-gameobject.md` - Complete function reference
- **Common Patterns** - `.origami/docs/md/40-common-patterns.md` - Best practices and examples
- **Deployment** - `.origami/docs/md/41-deployment.md` - Publishing your game

Or visit the [full documentation index](.origami/docs/md/README.md).

---

## 💡 Core Concepts

### GameObject Class

All game objects extend `GameObject`:

```typescript
import { GameObject } from 'origami-runtime';

export class obj_player extends GameObject {
  create(): void {
    this.sprite_index = 'spr_player';
    this.x = 100;
    this.y = 100;
  }

  step(): void {
    // Movement
    if (keyboard_check(vk_right)) this.x += 4;
    if (keyboard_check(vk_left)) this.x -= 4;

    // Jump
    if (keyboard_check_pressed(vk_space)) {
      this.vspeed = -10;
    }

    // Gravity
    this.vspeed += 0.5;

    // Collision
    if (place_meeting.call(this, this.x, this.y + this.vspeed, 'obj_wall')) {
      this.vspeed = 0;
    }
  }

  draw(): void {
    draw_self.call(this);
  }
}
```

### Built-in Properties

Every GameObject has GMS-style properties:

```typescript
// Position & motion
x, y, xprevious, yprevious, xstart, ystart
speed, direction, hspeed, vspeed

// Sprite & animation
sprite_index, image_index, image_speed
image_alpha, image_angle, image_xscale, image_yscale

// Rendering & behavior
visible, depth, order, persistent
```

### Global Functions

Familiar GameMaker functions available globally:

```typescript
// Instance management
await instance_create(x, y, 'obj_bullet');
instance_destroy.call(this);
instance_exists('obj_player');

// Collision
place_meeting.call(this, x, y, 'obj_wall');
const coin = instance_place.call(this, x, y, 'obj_coin');

// Input
keyboard_check(vk_space);
keyboard_check_pressed(vk_w);
mouse_check_button(mb_left);

// Drawing (in draw event)
draw_sprite('spr_player', 0, x, y);
draw_text(10, 10, 'Score: 100');
draw_set_color('#FF0000');
draw_rectangle(x1, y1, x2, y2, false);

// Room
await room_goto('room_level2');

// Utility
random(100);
irandom(10);
```

---

## 🎨 Templates

### Fresh Template
**Empty project to build from scratch**

Contains:
- Empty `objects/`, `sprites/` directories
- Single default room
- Basic initialization code
- Minimal configuration

Perfect for experienced developers who want full control.

### Platformer Template
**Complete working game example**

Contains:
- Player with WASD movement and jumping
- Walls and platforms
- Enemy AI
- Collectible items
- Full level layout
- All sprites included

Perfect for learning or building upon an existing game.

---

## 🔧 Debug Mode

Press **F3** or **~** in-game to toggle:
- FPS counter
- Instance count
- Collision box visualization (color-coded)
- View/camera position

---

## ✅ Status

**Current Version:** 0.1.0

**Complete and Functional:**
- ✅ Core game engine with 60 FPS fixed timestep
- ✅ GameObject system with all GMS events
- ✅ Sprite system with animation
- ✅ Keyboard & mouse input
- ✅ AABB collision detection
- ✅ Room system with JSON definitions
- ✅ View/camera with deadzone following
- ✅ Canvas 2D rendering with depth sorting
- ✅ Drawing API (sprites, text, shapes, colors)
- ✅ Debug overlay and tools
- ✅ Save/load with localStorage
- ✅ Complete platformer example
- ✅ Full documentation

**Ready For:**
- 🎯 Creating games
- 🎯 Community testing and feedback
- 🎯 Publishing to npm

---

## 🗺️ Roadmap

Future enhancements being considered:
- Sound/audio system
- Particle effects
- Tilemap support and collision
- More collision shapes (circles, precise pixel)
- Visual room editor
- Sprite/animation editor
- Pathfinding system
- Network/multiplayer support

---

## 🤝 Contributing

This is an MVP. Contributions, feedback, and bug reports are welcome!

1. Fork the repository
2. Create a feature branch from the `engine` branch
3. Make your changes
4. Submit a pull request

Check `.origami/docs/md/91-architecture.md` (after installation) for architecture details.

---

## 📝 License

MIT - See [LICENSE](LICENSE) for details

---

## 🔗 Repository Structure

This repository has multiple branches:

- **`main`** - Installer (what you just cloned)
- **`engine`** - Full engine source code (tagged as v0.1.0, v0.2.0, etc.)
- **`template/fresh`** - Fresh template (empty project)
- **`template/platformer`** - Platformer template (working example)

The installer fetches the engine and templates from these branches automatically.

---

**Built with ❤️ for game developers who love GameMaker Studio 1.4**
