import * as http from 'http';
import * as fs from 'fs/promises';
import * as path from 'path';
import { spawn } from 'child_process';

const MIME_TYPES: Record<string, string> = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.css': 'text/css',
};

export async function devCommand(args: string[]): Promise<void> {
    console.log('Starting Origami Engine dev server...');
    console.log('');

    // Start TypeScript compiler in watch mode
    console.log('Starting TypeScript compiler in watch mode...');
    const tsc = spawn('npx', ['tsc', '--watch'], {
        cwd: process.cwd(),
        stdio: 'inherit',
        shell: true,
    });

    // Give TypeScript time to do initial compilation
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Load game.json to get port
    let port = 3000;
    try {
        const gameConfigPath = path.join(process.cwd(), 'game.json');
        const gameConfig = JSON.parse(await fs.readFile(gameConfigPath, 'utf-8'));
        port = gameConfig.port || 3000;
    } catch (error) {
        console.warn('Could not load game.json, using default port 3000');
    }

    const server = http.createServer(async (req, res) => {
        try {
            await handleRequest(req, res);
        } catch (error) {
            console.error('Request error:', error);
            res.writeHead(500);
            res.end('Internal Server Error');
        }
    });

    server.listen(port, () => {
        console.log('');
        console.log(`✓ Dev server running at http://localhost:${port}`);
        console.log('  Press Ctrl+C to stop');
        console.log('');
        console.log('  Tip: Press F3 or ~ in-game to toggle debug mode');
        console.log('  Tip: TypeScript files will auto-recompile on save');
    });

    // Cleanup on exit
    process.on('SIGINT', () => {
        tsc.kill();
        process.exit();
    });
}

async function handleRequest(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
    let filePath = req.url === '/' ? '/index.html' : req.url || '/index.html';

    // Remove query string
    filePath = filePath.split('?')[0];

    // If requesting .js file from src/ or objects/, serve from bin/ instead
    if (filePath.match(/^\/(src|objects)\/.+\.js$/)) {
        filePath = '/bin' + filePath;
    }

    // Determine base path - if requesting from node_modules, look in parent directory
    let basePath = process.cwd();
    if (filePath.startsWith('/node_modules')) {
        // For workspace projects, node_modules is in parent directory
        try {
            // Check if file exists in parent's node_modules
            await fs.access(path.join(basePath, '..', filePath));
            basePath = path.join(basePath, '..');
        } catch {
            // If not, use current directory
        }
    }

    const fullPath = path.join(basePath, filePath);
    const ext = path.extname(filePath);
    const mimeType = MIME_TYPES[ext] || 'application/octet-stream';

    try {
        // Check if file exists
        await fs.access(fullPath);

        // Read and serve file
        const content = await fs.readFile(fullPath);

        res.writeHead(200, {
            'Content-Type': mimeType,
            'Access-Control-Allow-Origin': '*',
        });
        res.end(content);
    } catch (error) {
        // File not found
        res.writeHead(404);
        res.end('404 Not Found');
    }
}
