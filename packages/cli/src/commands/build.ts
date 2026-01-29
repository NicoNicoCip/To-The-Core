import * as fs from 'fs/promises';
import * as path from 'path';

export async function buildCommand(args: string[]): Promise<void> {
    console.log('Building game for production...');
    console.log('');

    const distPath = path.join(process.cwd(), 'dist');

    // Create dist directory
    await fs.mkdir(distPath, { recursive: true });
    console.log('✓ Created dist directory');

    // Note: For MVP, we'll just copy files
    // In a full implementation, we'd use a bundler like esbuild or rollup

    // Copy index.html
    await fs.copyFile(
        path.join(process.cwd(), 'index.html'),
        path.join(distPath, 'index.html')
    );
    console.log('✓ Copied index.html');

    // Copy src directory
    await copyDirectory(path.join(process.cwd(), 'src'), path.join(distPath, 'src'));
    console.log('✓ Copied src directory');

    // Copy objects directory
    await copyDirectory(path.join(process.cwd(), 'objects'), path.join(distPath, 'objects'));
    console.log('✓ Copied objects directory');

    // Copy sprites directory
    await copyDirectory(path.join(process.cwd(), 'sprites'), path.join(distPath, 'sprites'));
    console.log('✓ Copied sprites directory');

    // Copy rooms directory
    await copyDirectory(path.join(process.cwd(), 'rooms'), path.join(distPath, 'rooms'));
    console.log('✓ Copied rooms directory');

    // Copy game.json
    await fs.copyFile(
        path.join(process.cwd(), 'game.json'),
        path.join(distPath, 'game.json')
    );
    console.log('✓ Copied game.json');

    console.log('');
    console.log('✓ Build complete!');
    console.log('  Output: ./dist/');
    console.log('');
    console.log('  Note: For MVP, this is a simple copy.');
    console.log('  In production, you would want to:');
    console.log('    - Bundle and minify TypeScript');
    console.log('    - Optimize images');
    console.log('    - Tree-shake unused code');
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
