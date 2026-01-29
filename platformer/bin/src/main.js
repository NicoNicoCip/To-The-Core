/// <reference path="../node_modules/origami-runtime/src/global.d.ts" />
import { GameEngine } from 'origami-runtime';
import { obj_player } from '../objects/obj_player.js';
import { obj_wall } from '../objects/obj_wall.js';
import { obj_collectible } from '../objects/obj_collectible.js';
import { obj_enemy } from '../objects/obj_enemy.js';
// Get canvas
const canvas = document.getElementById('game-canvas');
// Create engine
const engine = new GameEngine({
    canvas,
    assetsPath: '.',
    gameId: 'platformer',
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
    }
    catch (error) {
        console.error('Failed to start game:', error);
    }
}
startGame();
