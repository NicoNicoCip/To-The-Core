/// <reference path="../node_modules/origami-runtime/src/global.d.ts" />
import { GameObject } from 'origami-runtime';
export class obj_collectible extends GameObject {
    constructor() {
        super(...arguments);
        this.collected = false;
        this.respawnTimer = 0;
        this.respawnDelay = 180; // 3 seconds at 60 FPS
    }
    create() {
        this.sprite_index = 'spr_collectible';
    }
    step() {
        if (!this.collected) {
            // Simple bob animation while not collected
            this.y = this.ystart + Math.sin(Date.now() / 200) * 4;
        }
        else {
            // Respawn logic
            if (this.respawnTimer > 0) {
                this.respawnTimer--;
                if (this.respawnTimer === 0) {
                    this.collected = false;
                    this.visible = true;
                }
            }
        }
    }
    collect() {
        if (!this.collected) {
            this.collected = true;
            this.visible = false;
            this.respawnTimer = this.respawnDelay;
        }
    }
}
