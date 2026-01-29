import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function createCommand(args: string[]): Promise<void> {
    const projectName = args[0];

    if (!projectName) {
        console.error('Error: Project name is required');
        console.log('Usage: ori create <project-name>');
        process.exit(1);
    }

    // Validate project name
    if (!/^[a-z0-9-_]+$/i.test(projectName)) {
        console.error('Error: Project name can only contain letters, numbers, hyphens, and underscores');
        process.exit(1);
    }

    const projectPath = path.join(process.cwd(), projectName);

    // Check if directory already exists
    try {
        await fs.access(projectPath);
        console.error(`Error: Directory "${projectName}" already exists`);
        process.exit(1);
    } catch {
        // Directory doesn't exist, we can proceed
    }

    console.log(`Creating new Origami Engine project: ${projectName}`);
    console.log('');

    // Create project structure
    await createProjectStructure(projectPath, projectName);

    console.log('');
    console.log('✓ Project created successfully!');
    console.log('');
    console.log('Next steps:');
    console.log(`  cd ${projectName}`);
    console.log('  pnpm install');
    console.log('  pnpm start');
    console.log('');
}

async function createProjectStructure(projectPath: string, projectName: string): Promise<void> {
    // Create directories
    const dirs = [
        projectPath,
        path.join(projectPath, 'sprites'),
        path.join(projectPath, 'objects'),
        path.join(projectPath, 'rooms'),
        path.join(projectPath, 'src'),
    ];

    for (const dir of dirs) {
        await fs.mkdir(dir, { recursive: true });
        console.log(`✓ Created ${path.relative(projectPath, dir) || '.'}`);
    }

    // Copy template files
    const templatePath = path.join(__dirname, '..', '..', 'templates', 'platformer');

    await copyTemplate(templatePath, projectPath, projectName);
}

async function copyTemplate(templatePath: string, projectPath: string, projectName: string): Promise<void> {
    // For now, we'll generate the files directly
    // Later, we can load them from a template directory

    // Generate package.json
    const packageJson = {
        name: projectName,
        version: '1.0.0',
        type: 'module',
        scripts: {
            start: 'ori dev',
            dev: 'ori dev',
            build: 'ori build',
            clean: 'rm -rf bin',
        },
        dependencies: {
            'origami-runtime': 'workspace:*',
        },
        devDependencies: {
            'origami-cli': 'workspace:*',
            typescript: '^5.3.3',
        },
    };

    await fs.writeFile(
        path.join(projectPath, 'package.json'),
        JSON.stringify(packageJson, null, 2)
    );
    console.log('✓ Created package.json');

    // Generate tsconfig.json
    const tsconfig = {
        compilerOptions: {
            target: 'ES2020',
            module: 'ESNext',
            lib: ['ES2020', 'DOM'],
            moduleResolution: 'bundler',
            strict: true,
            esModuleInterop: true,
            skipLibCheck: true,
            forceConsistentCasingInFileNames: true,
            resolveJsonModule: true,
            outDir: './bin',
            rootDir: '.',
        },
        include: ['src/**/*', 'objects/**/*', 'node_modules/origami-runtime/src/global.d.ts'],
        exclude: ['node_modules'],
    };

    await fs.writeFile(
        path.join(projectPath, 'tsconfig.json'),
        JSON.stringify(tsconfig, null, 2)
    );
    console.log('✓ Created tsconfig.json');

    // Generate game.json
    const gameJson = {
        title: projectName,
        width: 640,
        height: 480,
        port: 3000,
        sprites: ['spr_player', 'spr_wall', 'spr_collectible', 'spr_enemy'],
        objects: ['obj_player', 'obj_wall', 'obj_collectible', 'obj_enemy'],
        rooms: ['room_level1'],
        startRoom: 'room_level1',
    };

    await fs.writeFile(
        path.join(projectPath, 'game.json'),
        JSON.stringify(gameJson, null, 2)
    );
    console.log('✓ Created game.json');

    // Generate index.html
    const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${projectName}</title>
  <script type="importmap">
  {
    "imports": {
      "origami-runtime": "/node_modules/origami-runtime/dist/index.js",
      "uuid": "/node_modules/.pnpm/uuid@9.0.1/node_modules/uuid/dist/esm-browser/index.js"
    }
  }
  </script>
  <style>
    body {
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #000;
    }
    canvas {
      image-rendering: pixelated;
      image-rendering: crisp-edges;
    }
  </style>
</head>
<body>
  <canvas id="game-canvas"></canvas>
  <script type="module" src="/bin/src/main.js"></script>
</body>
</html>`;

    await fs.writeFile(path.join(projectPath, 'index.html'), indexHtml);
    console.log('✓ Created index.html');

    // Generate main.ts
    const mainTs = `/// <reference path="../node_modules/origami-runtime/src/global.d.ts" />
import { GameEngine } from 'origami-runtime';
import { obj_player } from '../objects/obj_player.js';
import { obj_wall } from '../objects/obj_wall.js';
import { obj_collectible } from '../objects/obj_collectible.js';
import { obj_enemy } from '../objects/obj_enemy.js';

// Get canvas
const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;

// Create engine
const engine = new GameEngine({
  canvas,
  assetsPath: '.',
  gameId: '${projectName}',
  startRoom: 'room_level1',
});

// Register objects
engine.registerObject(obj_player);
engine.registerObject(obj_wall);
engine.registerObject(obj_collectible);
engine.registerObject(obj_enemy);

// Load game config and start
async function startGame() {
  try {
    await engine.loadGameConfig('./game.json');
    await engine.start();
  } catch (error) {
    console.error('Failed to start game:', error);
  }
}

startGame();
`;

    await fs.writeFile(path.join(projectPath, 'src', 'main.ts'), mainTs);
    console.log('✓ Created src/main.ts');

    // Generate .gitignore
    const gitignore = `node_modules/
dist/
build/
bin/
*.log
.DS_Store
.vscode/
.idea/
*.swp
`;

    await fs.writeFile(path.join(projectPath, '.gitignore'), gitignore);
    console.log('✓ Created .gitignore');

    // Generate README.md
    const readme = `# ${projectName}

A platformer game built with Origami Engine.

## Getting Started

\`\`\`bash
pnpm install
pnpm start
\`\`\`

## Controls

- WASD: Move player
- Space: Jump (placeholder - implement in obj_player)

## Development

- \`pnpm start\` - Start development server
- \`pnpm build\` - Build for production
- Press F3 or ~ in-game to toggle debug mode

## Project Structure

- \`objects/\` - Game object TypeScript classes
- \`sprites/\` - Sprite assets and metadata
- \`rooms/\` - Room definitions (JSON)
- \`src/\` - Main game entry point
`;

    await fs.writeFile(path.join(projectPath, 'README.md'), readme);
    console.log('✓ Created README.md');

    console.log('');
    console.log('Generating template game objects and assets...');
    console.log('');

    // Generate template objects and rooms
    await generateTemplateObjects(projectPath);
    await generateTemplateRooms(projectPath);
    await generateTemplateSprites(projectPath);
}

async function generateTemplateObjects(projectPath: string): Promise<void> {
    // obj_player.ts
    const objPlayer = `/// <reference path="../node_modules/origami-runtime/src/global.d.ts" />
import { GameObject, vk_a, vk_d, vk_space } from 'origami-runtime';

export class obj_player extends GameObject {
  private moveSpeed: number = 4;
  private jumpSpeed: number = 8;
  private gravity: number = 0.5;
  private maxFallSpeed: number = 10;
  private onGround: boolean = false;

  create(): void {
    this.sprite_index = 'spr_player';
  }

  step(): void {
    // Horizontal movement
    let hInput = 0;
    if (keyboard_check(vk_a)) hInput -= 1;
    if (keyboard_check(vk_d)) hInput += 1;

    this.hspeed = hInput * this.moveSpeed;

    // Check for horizontal collision before moving
    if (place_meeting(this.x + this.hspeed, this.y, 'obj_wall')) {
      // Push out of collision
      while (!place_meeting(this.x + Math.sign(this.hspeed), this.y, 'obj_wall')) {
        this.x += Math.sign(this.hspeed);
      }
      this.hspeed = 0;
    }

    // Apply gravity
    this.vspeed += this.gravity;
    if (this.vspeed > this.maxFallSpeed) {
      this.vspeed = this.maxFallSpeed;
    }

    // Check if on ground
    this.onGround = place_meeting(this.x, this.y + 1, 'obj_wall');

    // Jumping
    if (this.onGround && keyboard_check_pressed(vk_space)) {
      this.vspeed = -this.jumpSpeed;
    }

    // Check for vertical collision
    if (place_meeting(this.x, this.y + this.vspeed, 'obj_wall')) {
      // Push out of collision
      while (!place_meeting(this.x, this.y + Math.sign(this.vspeed), 'obj_wall')) {
        this.y += Math.sign(this.vspeed);
      }
      this.vspeed = 0;
    }

    // Check for collectibles
    const collectible = instance_place(this.x, this.y, 'obj_collectible');
    if (collectible) {
      instance_destroy.call(collectible);
      console.log('Collected item!');
    }
  }
}
`;

    await fs.writeFile(path.join(projectPath, 'objects', 'obj_player.ts'), objPlayer);
    console.log('✓ Created objects/obj_player.ts');

    // obj_wall.ts
    const objWall = `/// <reference path="../node_modules/origami-runtime/src/global.d.ts" />
import { GameObject } from 'origami-runtime';

export class obj_wall extends GameObject {
  create(): void {
    this.sprite_index = 'spr_wall';
  }
}
`;

    await fs.writeFile(path.join(projectPath, 'objects', 'obj_wall.ts'), objWall);
    console.log('✓ Created objects/obj_wall.ts');

    // obj_collectible.ts
    const objCollectible = `/// <reference path="../node_modules/origami-runtime/src/global.d.ts" />
import { GameObject } from 'origami-runtime';

export class obj_collectible extends GameObject {
  private respawnTimer: number = 0;
  private respawnDelay: number = 180; // 3 seconds at 60 FPS

  create(): void {
    this.sprite_index = 'spr_collectible';
  }

  step(): void {
    // Simple bob animation
    this.y = this.ystart + Math.sin(Date.now() / 200) * 4;

    // Respawn logic (if destroyed)
    if (this.respawnTimer > 0) {
      this.respawnTimer--;
      if (this.respawnTimer === 0) {
        this.visible = true;
      }
    }
  }
}
`;

    await fs.writeFile(path.join(projectPath, 'objects', 'obj_collectible.ts'), objCollectible);
    console.log('✓ Created objects/obj_collectible.ts');

    // obj_enemy.ts
    const objEnemy = `/// <reference path="../node_modules/origami-runtime/src/global.d.ts" />
import { GameObject } from 'origami-runtime';

export class obj_enemy extends GameObject {
  private moveSpeed: number = 2;

  create(): void {
    this.sprite_index = 'spr_enemy';
    this.direction = 1; // 1 = right, -1 = left
  }

  step(): void {
    // Move in current direction
    this.hspeed = this.moveSpeed * this.direction;

    // Check for walls or edges
    const nextX = this.x + this.hspeed;
    const nextY = this.y + 1;

    // Turn around if hitting wall or reaching edge
    if (place_meeting(nextX, this.y, 'obj_wall') || !place_meeting(nextX, nextY, 'obj_wall')) {
      this.direction *= -1;
    }
  }
}
`;

    await fs.writeFile(path.join(projectPath, 'objects', 'obj_enemy.ts'), objEnemy);
    console.log('✓ Created objects/obj_enemy.ts');
}

async function generateTemplateRooms(projectPath: string): Promise<void> {
    const room = {
        name: 'room_level1',
        width: 640,
        height: 480,
        speed: 60,
        backgroundColor: '#87CEEB',
        instances: [
            // Player
            { object: 'obj_player', x: 100, y: 100 },

            // Floor
            { object: 'obj_wall', x: 0, y: 448 },
            { object: 'obj_wall', x: 32, y: 448 },
            { object: 'obj_wall', x: 64, y: 448 },
            { object: 'obj_wall', x: 96, y: 448 },
            { object: 'obj_wall', x: 128, y: 448 },
            { object: 'obj_wall', x: 160, y: 448 },
            { object: 'obj_wall', x: 192, y: 448 },
            { object: 'obj_wall', x: 224, y: 448 },
            { object: 'obj_wall', x: 256, y: 448 },
            { object: 'obj_wall', x: 288, y: 448 },
            { object: 'obj_wall', x: 320, y: 448 },
            { object: 'obj_wall', x: 352, y: 448 },
            { object: 'obj_wall', x: 384, y: 448 },
            { object: 'obj_wall', x: 416, y: 448 },
            { object: 'obj_wall', x: 448, y: 448 },
            { object: 'obj_wall', x: 480, y: 448 },
            { object: 'obj_wall', x: 512, y: 448 },
            { object: 'obj_wall', x: 544, y: 448 },
            { object: 'obj_wall', x: 576, y: 448 },
            { object: 'obj_wall', x: 608, y: 448 },

            // Platforms
            { object: 'obj_wall', x: 200, y: 350 },
            { object: 'obj_wall', x: 232, y: 350 },
            { object: 'obj_wall', x: 264, y: 350 },

            { object: 'obj_wall', x: 400, y: 280 },
            { object: 'obj_wall', x: 432, y: 280 },

            // Collectibles
            { object: 'obj_collectible', x: 150, y: 400 },
            { object: 'obj_collectible', x: 232, y: 310 },
            { object: 'obj_collectible', x: 416, y: 240 },

            // Enemy
            { object: 'obj_enemy', x: 300, y: 416 },
        ],
        views: [
            {
                enabled: true,
                xview: 0,
                yview: 0,
                wview: 640,
                hview: 480,
                xport: 0,
                yport: 0,
                wport: 640,
                hport: 480,
                hborder: 200,
                vborder: 150,
                hspeed: -1,
                vspeed: -1,
                object: 'obj_player',
            },
        ],
    };

    await fs.writeFile(
        path.join(projectPath, 'rooms', 'room_level1.json'),
        JSON.stringify(room, null, 2)
    );
    console.log('✓ Created rooms/room_level1.json');
}

async function generateTemplateSprites(projectPath: string): Promise<void> {
    // Try to copy sprites from template folder
    const templateSpritesPath = path.join(__dirname, '..', '..', 'templates', 'platformer', 'sprites');

    try {
        await fs.access(templateSpritesPath);
        // Template exists, copy it
        await copyDirectory(templateSpritesPath, path.join(projectPath, 'sprites'));
        console.log('✓ Created sprites/ with template assets');
        return;
    } catch {
        // Template doesn't exist, generate placeholders
    }

    // Fallback: generate placeholder structure
    const sprites = [
        {
            name: 'spr_player',
            width: 32,
            height: 32,
            color: '#00FF00',
            origin: { x: 16, y: 16 },
            description: 'Green player character - 32x32px square with 1px black border'
        },
        {
            name: 'spr_wall',
            width: 32,
            height: 32,
            color: '#808080',
            origin: { x: 0, y: 0 },
            description: 'Gray wall/platform block - 32x32px square'
        },
        {
            name: 'spr_collectible',
            width: 16,
            height: 16,
            color: '#FFFF00',
            origin: { x: 8, y: 8 },
            description: 'Yellow collectible coin/item - 16x16px circle or diamond'
        },
        {
            name: 'spr_enemy',
            width: 32,
            height: 32,
            color: '#FF0000',
            origin: { x: 16, y: 16 },
            description: 'Red enemy - 32x32px square with 1px black border'
        },
    ];

    for (const sprite of sprites) {
        const spriteDir = path.join(projectPath, 'sprites', sprite.name);
        await fs.mkdir(spriteDir, { recursive: true });

        // Create metadata
        const metadata = {
            origin: sprite.origin,
            fps: 10,
        };

        await fs.writeFile(
            path.join(spriteDir, 'metadata.json'),
            JSON.stringify(metadata, null, 2)
        );

        // Create placeholder instructions
        const placeholder = `SPRITE: ${sprite.name}
Size: ${sprite.width}x${sprite.height} pixels
Color: ${sprite.color}
Origin: (${sprite.origin.x}, ${sprite.origin.y})

Description:
${sprite.description}

Required filename: frame_0.png

Create this as a PNG image and save it as frame_0.png in this folder.`;

        await fs.writeFile(path.join(spriteDir, 'PLACEHOLDER.txt'), placeholder);

        console.log(`✓ Created sprites/${sprite.name}/ (needs frame_0.png)`);
    }
}

async function copyDirectory(src: string, dest: string): Promise<void> {
    await fs.mkdir(dest, { recursive: true });

    const entries = await fs.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            await copyDirectory(srcPath, destPath);
        } else {
            await fs.copyFile(srcPath, destPath);
        }
    }
}
