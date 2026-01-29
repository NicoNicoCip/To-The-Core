# Origami CLI

**Command-line tool for creating and building Origami Engine games**

The Origami CLI (`ori`) provides project scaffolding, development server, and build tools for games built with Origami Engine.

## Installation

### Global Installation (Recommended)

```bash
npm install -g origami-cli
```

After installation, the `ori` command is available system-wide.

### Local Installation

```bash
npm install origami-cli
```

Use with npx:
```bash
npx ori <command>
```

## Quick Start

### Create a New Game

```bash
# Create project
ori create my-platformer

# Navigate to project
cd my-platformer

# Install dependencies
npm install

# Start development server
npm start
```

Open `http://localhost:3000` in your browser and play!

## Commands

### `ori create <project-name>`

Creates a new game project from the platformer template.

```bash
ori create awesome-game
```

**Includes**:
- Complete platformer example
- Player with WASD movement and jumping
- Enemies with patrol AI
- Collectible items
- Working room with all objects
- All sprites (PNG + metadata)
- TypeScript configuration
- Development scripts

### `ori dev`

Starts a local development server.

```bash
cd my-game
ori dev
```

- Serves on `http://localhost:3000`
- Serves static files
- Manual browser refresh to see changes

### `ori build`

Builds the game for production.

```bash
ori build
```

- Compiles TypeScript
- Copies all assets
- Creates `build/` directory ready for deployment

### `ori help`

Shows help information.

```bash
ori help
ori --help
ori -h
```

## Project Structure

Created projects have this structure:

```
my-game/
├── objects/           # Game object classes (.ts files)
│   ├── obj_player.ts
│   ├── obj_wall.ts
│   ├── obj_collectible.ts
│   └── obj_enemy.ts
├── sprites/          # Sprite assets
│   ├── spr_player/
│   │   ├── metadata.json
│   │   └── frame_0.png
│   └── ...
├── rooms/            # Room definitions (JSON)
│   └── room_level1.json
├── src/              # Entry point
│   └── main.ts
├── game.json         # Game configuration
├── index.html        # HTML entry
├── package.json
└── tsconfig.json
```

## Configuration

### game.json

```json
{
  "title": "My Game",
  "width": 640,
  "height": 480,
  "backgroundColor": "#000000",
  "startRoom": "room_level1",
  "devServer": {
    "port": 3000
  }
}
```

### package.json Scripts

Generated projects include these scripts:

```json
{
  "scripts": {
    "start": "ori dev",
    "dev": "ori dev",
    "build": "ori build"
  }
}
```

## Development Workflow

1. **Create Project**
   ```bash
   ori create my-game && cd my-game && npm install
   ```

2. **Run Dev Server**
   ```bash
   npm start
   ```

3. **Edit Code**
   - Modify objects in `objects/`
   - Add sprites to `sprites/`
   - Edit rooms in `rooms/`

4. **Refresh Browser**
   - Press F5 to see changes

5. **Debug**
   - Press F3 in-game for debug overlay
   - Shows FPS, instance count, collision boxes

6. **Build for Production**
   ```bash
   npm run build
   ```

7. **Deploy**
   - Upload `build/` folder to any static host
   - Compatible with: GitHub Pages, Netlify, Vercel, itch.io

## Template Contents

The platformer template includes:

### Objects

- **obj_player** - WASD movement, jumping, gravity, collision
- **obj_wall** - Solid platforms
- **obj_collectible** - Collectible items with respawn
- **obj_enemy** - Patrol AI with wall detection

### Features Demonstrated

- Player controls and physics
- Collision detection
- Animation
- Camera following
- Debug visualization

## Example: Adding a New Object

1. **Create object file**: `objects/obj_powerup.ts`

```typescript
import { GameObject } from 'origami-runtime';

export class obj_powerup extends GameObject {
  create(): void {
    this.sprite_index = 'spr_powerup';
  }

  step(): void {
    const player = instance_place.call(this, this.x, this.y, 'obj_player');
    if (player) {
      // Grant power-up
      instance_destroy.call(this);
    }
  }
}
```

2. **Register in main.ts**:

```typescript
import { obj_powerup } from '../objects/obj_powerup.js';

const objectTypes = {
  // ... existing objects
  obj_powerup
};
```

3. **Add to room** (`rooms/room_level1.json`):

```json
{
  "instances": [
    { "object": "obj_powerup", "x": 300, "y": 200 }
  ]
}
```

## Deployment

### itch.io

```bash
npm run build
# Zip the build/ folder
# Upload to itch.io as HTML5 game
```

### GitHub Pages

```bash
npm run build
# Push build/ to gh-pages branch
```

### Netlify/Vercel

```bash
# Connect repository
# Set build command: npm run build
# Set publish directory: build
```

## Documentation

For complete command reference, configuration options, and advanced usage:

**[📖 Full Documentation](DOCUMENTATION.md)**

The documentation includes:
- Detailed command reference
- Project structure guide
- Configuration options
- Template system
- Workflow guides
- Troubleshooting

## Troubleshooting

### Command not found: ori

```bash
# Install globally
npm install -g origami-cli

# Or use npx
npx origami-cli create my-game
```

### Port 3000 already in use

Change port in `game.json`:

```json
{
  "devServer": {
    "port": 3001
  }
}
```

### Assets not loading

- Verify sprite folder structure
- Check `metadata.json` format
- Ensure PNG files named `frame_0.png`, `frame_1.png`, etc.

## Requirements

- Node.js 18.0.0 or higher
- Modern web browser

## License

MIT

## Links

- [Origami Engine Repository](https://github.com/yourusername/origami-engine)
- [Full Documentation](DOCUMENTATION.md)
- [Runtime Package](../runtime/)
- [Example Game](../../platformer/)
