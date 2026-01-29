#!/usr/bin/env node

import { createCommand } from './commands/create.js';
import { devCommand } from './commands/dev.js';
import { buildCommand } from './commands/build.js';

const args = process.argv.slice(2);
const command = args[0];

async function main() {
    try {
        switch (command) {
            case 'create':
                await createCommand(args.slice(1));
                break;

            case 'dev':
                await devCommand(args.slice(1));
                break;

            case 'build':
                await buildCommand(args.slice(1));
                break;

            case '--help':
            case '-h':
            case 'help':
                showHelp();
                break;

            default:
                console.error(`Unknown command: ${command}`);
                console.log('Run "ori --help" for usage information');
                process.exit(1);
        }
    } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : error);
        process.exit(1);
    }
}

function showHelp() {
    console.log(`
Origami Engine CLI - Create GMS-style games with TypeScript

Usage:
  ori <command> [options]

Commands:
  create <project-name>   Create a new game project
  dev                     Start development server
  build                   Build game for production
  help                    Show this help message

Examples:
  ori create my-platformer
  ori dev
  ori build

For more information, visit: https://github.com/yourusername/origami-engine
  `);
}

main();
