#!/usr/bin/env node

/**
 * Origami Engine - Game Project Initializer
 *
 * This script sets up a new game project by:
 * 1. Fetching the engine from the 'engine' branch into .origami/
 * 2. Fetching a template from template branches
 * 3. Setting up the project structure
 *
 * Usage: node .origami/init-game.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rootDir = process.cwd();
const origamiDir = path.join(rootDir, '.origami');

// Colors for terminal output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    yellow: '\x1b[33m',
    red: '\x1b[31m'
};

function log(message, color = 'reset') {
    console.log(colors[color] + message + colors.reset);
}

function ask(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question(colors.bright + question + colors.reset, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}

/**
 * Fetch engine code from 'engine' branch
 */
async function fetchEngine() {
    log('📦 Fetching Origami Engine...', 'blue');

    try {
        // Get the remote URL
        const remoteUrl = execSync('git config --get https://github.com/NicoNicoCip/Origami-Engine', {
            cwd: rootDir,
            encoding: 'utf-8'
        }).trim();

        // Clone the engine branch into a temp directory
        const tempDir = path.join(rootDir, '.temp-engine');
        execSync(`git clone --single-branch --branch engine --depth 1 "${remoteUrl}" "${tempDir}"`, {
            cwd: rootDir,
            stdio: 'pipe'
        });

        // Copy .origami contents from temp
        const tempOrigamiDir = path.join(tempDir, '.origami');
        const copyRecursive = (src, dest) => {
            const entries = fs.readdirSync(src, { withFileTypes: true });

            for (const entry of entries) {
                const srcPath = path.join(src, entry.name);
                const destPath = path.join(dest, entry.name);

                if (entry.isDirectory()) {
                    fs.mkdirSync(destPath, { recursive: true });
                    copyRecursive(srcPath, destPath);
                } else {
                    fs.copyFileSync(srcPath, destPath);
                }
            }
        };

        copyRecursive(tempOrigamiDir, origamiDir);

        // Clean up temp directory
        fs.rmSync(tempDir, { recursive: true, force: true });

        log('✅ Engine fetched successfully', 'green');
    } catch (error) {
        log('❌ Failed to fetch engine', 'red');
        log(error.message, 'red');
        throw error;
    }
}

/**
 * Fetch template from template branch
 */
async function fetchTemplate(templateName) {
    log(`📦 Fetching ${templateName} template...`, 'blue');

    try {
        // Get the remote URL
        const remoteUrl = execSync('git config --get https://github.com/NicoNicoCip/Origami-Engine', {
            cwd: rootDir,
            encoding: 'utf-8'
        }).trim();

        // Map template name to branch
        const branchName = `template/${templateName}`;

        // Clone template into temp directory
        const tempDir = path.join(rootDir, '.temp-template');
        execSync(`git clone --single-branch --branch ${branchName} --depth 1 "${remoteUrl}" "${tempDir}"`, {
            cwd: rootDir,
            stdio: 'pipe'
        });

        // Copy template files to root (excluding .git and .origami)
        const copyRecursive = (src, dest) => {
            const entries = fs.readdirSync(src, { withFileTypes: true });

            for (const entry of entries) {
                // Skip .git and .origami directories
                if (entry.name === '.git' || entry.name === '.origami') continue;

                const srcPath = path.join(src, entry.name);
                const destPath = path.join(dest, entry.name);

                if (entry.isDirectory()) {
                    fs.mkdirSync(destPath, { recursive: true });
                    copyRecursive(srcPath, destPath);
                } else {
                    fs.copyFileSync(srcPath, destPath);
                }
            }
        };

        copyRecursive(tempDir, rootDir);

        // Clean up temp directory
        fs.rmSync(tempDir, { recursive: true, force: true });

        log('✅ Template copied successfully', 'green');
    } catch (error) {
        log('❌ Failed to fetch template', 'red');
        log(error.message, 'red');
        throw error;
    }
}

/**
 * Replace placeholders in all text files
 */
function replaceInAllFiles(replacements) {
    log('📝 Processing placeholders...', 'blue');

    const textExtensions = ['.ts', '.js', '.json', '.html', '.md', '.txt', '.css'];
    const skipDirs = ['node_modules', '.git', 'bin', 'dist', 'build', '.origami'];

    let processedCount = 0;

    function processDirectory(dir) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);

            if (entry.isDirectory()) {
                if (!skipDirs.includes(entry.name)) {
                    processDirectory(fullPath);
                }
            } else if (entry.isFile()) {
                const ext = path.extname(entry.name).toLowerCase();
                if (textExtensions.includes(ext)) {
                    try {
                        let content = fs.readFileSync(fullPath, 'utf-8');
                        let modified = false;

                        for (const [placeholder, value] of Object.entries(replacements)) {
                            if (content.includes(placeholder)) {
                                content = content.replace(
                                    new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
                                    value
                                );
                                modified = true;
                            }
                        }

                        if (modified) {
                            fs.writeFileSync(fullPath, content, 'utf-8');
                            processedCount++;
                        }
                    } catch (error) {
                        // Skip binary files
                    }
                }
            }
        }
    }

    processDirectory(rootDir);
    log(`✅ Processed ${processedCount} file(s)`, 'green');
}

/**
 * Main initialization flow
 */
async function main() {
    console.clear();
    log('╔════════════════════════════════════════╗', 'cyan');
    log('║   🎮 Initialize Origami Game  🎨     ║', 'cyan');
    log('╚════════════════════════════════════════╝', 'cyan');
    console.log();

    // Check if already initialized (has packages in .origami)
    const packagesDir = path.join(origamiDir, 'packages');
    if (fs.existsSync(packagesDir)) {
        log('⚠️  Engine already initialized!', 'yellow');
        log('To re-initialize, delete the .origami/packages folder first.', 'yellow');
        process.exit(0);
    }

    // Step 1: Fetch engine
    console.log();
    log('────────────────────────────────────────', 'cyan');
    log('Step 1: Fetching Engine', 'bright');
    log('────────────────────────────────────────', 'cyan');
    console.log();

    await fetchEngine();

    // Step 2: Choose template
    console.log();
    log('────────────────────────────────────────', 'cyan');
    log('Step 2: Choose Template', 'bright');
    log('────────────────────────────────────────', 'cyan');
    console.log();

    log('Choose starting template:', 'bright');
    log('  1. fresh      - Empty project, build from scratch', 'blue');
    log('  2. platformer - Working example to modify', 'blue');
    console.log();

    const templateChoice = await ask('Template (1-2): ');
    const templateMap = { '1': 'fresh', '2': 'platformer' };
    const selectedTemplate = templateMap[templateChoice] || 'fresh';

    log(`Selected: ${selectedTemplate}`, 'cyan');

    // Step 3: Project details
    console.log();
    log('────────────────────────────────────────', 'cyan');
    log('Step 3: Project Details', 'bright');
    log('────────────────────────────────────────', 'cyan');
    console.log();

    const projectName = path.basename(rootDir);
    const gameTitle = await ask(`Game title (display name) [${projectName}]: `) || projectName;
    const author = await ask('Author (optional): ') || '';
    const description = await ask('Description (optional): ') || 'A game built with Origami Engine';

    // Step 4: Fetch template
    console.log();
    log('────────────────────────────────────────', 'cyan');
    log('Step 4: Setting Up Template', 'bright');
    log('────────────────────────────────────────', 'cyan');
    console.log();

    await fetchTemplate(selectedTemplate);

    // Step 5: Replace placeholders
    console.log();
    log('────────────────────────────────────────', 'cyan');
    log('Step 5: Configuring Project', 'bright');
    log('────────────────────────────────────────', 'cyan');
    console.log();

    const replacements = {
        '{{PROJECT_NAME}}': projectName,
        '{{PROJECT_TITLE}}': gameTitle,
        '{{AUTHOR}}': author,
        '{{DESCRIPTION}}': description,
        '{{DATE}}': new Date().toISOString().split('T')[0],
        '{{YEAR}}': new Date().getFullYear().toString(),
        '{{ENGINE_VERSION}}': '0.1.0'
    };

    replaceInAllFiles(replacements);

    // Step 6: Create .gitignore
    console.log();
    log('────────────────────────────────────────', 'cyan');
    log('Step 6: Setting Up Git', 'bright');
    log('────────────────────────────────────────', 'cyan');
    console.log();

    const gitignoreContent = `# Game build outputs
node_modules/
bin/
dist/
js/
lib/

# TypeScript
*.tsbuildinfo

# Logs
*.log
npm-debug.log*

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Origami Engine (DO NOT commit the engine folder)
.origami/

# Keep your game files version controlled:
# - objects/
# - sprites/
# - rooms/
# - src/
# - game.json
# - package.json
# - index.html
# - README.md
`;

    fs.writeFileSync(path.join(rootDir, '.gitignore'), gitignoreContent);
    log('✅ Created .gitignore', 'green');

    // Reset git repository
    log('Resetting git repository...', 'yellow');
    try {
        // Remove old remote
        try {
            execSync('git remote remove origin', { cwd: rootDir, stdio: 'pipe' });
        } catch (e) {
            // Remote might not exist
        }

        // Remove git history
        fs.rmSync(path.join(rootDir, '.git'), { recursive: true, force: true });

        // Initialize fresh repository
        execSync('git init', { cwd: rootDir, stdio: 'pipe' });
        execSync('git add .', { cwd: rootDir, stdio: 'pipe' });
        execSync('git commit -m "Initial commit: Origami Engine game project"', { cwd: rootDir, stdio: 'pipe' });

        log('✅ Fresh git repository initialized', 'green');
        log('💡 Add your remote with: git remote add origin <your-repo-url>', 'yellow');
    } catch (error) {
        log('⚠️  Could not reset git repository', 'yellow');
        log('   You may want to manually initialize git for your project', 'yellow');
    }

    // Success!
    console.log();
    log('════════════════════════════════════════', 'green');
    log('✨ Game project initialized!', 'bright');
    log('════════════════════════════════════════', 'green');
    console.log();
    log('Your game is ready to develop!', 'cyan');
    console.log();
    log('Project structure:', 'bright');
    log('  .origami/     - Engine (hidden)', 'blue');
    log('  objects/      - Game objects', 'blue');
    log('  sprites/      - Sprites', 'blue');
    log('  rooms/        - Levels', 'blue');
    log('  game.json     - Game config', 'blue');
    log('  index.html    - Entry point', 'blue');
    console.log();
    log('Next steps:', 'bright');
    log('  1. Open index.html in your browser', 'blue');
    log('  2. Start coding in objects/ and sprites/', 'blue');
    log('  3. Press F3 in-game for debug mode', 'blue');
    console.log();
}

main().catch((error) => {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
});
