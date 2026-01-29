/// <reference path="../node_modules/origami-runtime/src/global.d.ts" />
import { GameObject } from 'origami-runtime';
export class obj_enemy extends GameObject {
    constructor() {
        super(...arguments);
        this.moveSpeed = 1;
        this.gravity = 0.5;
        this.maxFallSpeed = 10;
        this.moveDirection = 1; // 1 = right, -1 = left
        this.directionTimer = 0;
        this.directionChangeTime = 180; // 3 seconds at 60 FPS
    }
    create() {
        this.sprite_index = 'spr_enemy';
        this.directionTimer = this.directionChangeTime;
    }
    step() {
        // Horizontal movement
        this.hspeed = this.moveSpeed * this.moveDirection;
        // Check for horizontal collision
        if (this.hspeed !== 0 && this.place_meeting(this.x + this.hspeed, this.y, 'obj_wall')) {
            const sign = Math.sign(this.hspeed);
            while (!this.place_meeting(this.x + sign, this.y, 'obj_wall')) {
                this.x += sign;
            }
            this.hspeed = 0;
        }
        // Apply gravity
        this.vspeed += this.gravity;
        if (this.vspeed > this.maxFallSpeed) {
            this.vspeed = this.maxFallSpeed;
        }
        // Check for vertical collision
        if (this.vspeed !== 0 && this.place_meeting(this.x, this.y + this.vspeed, 'obj_wall')) {
            const sign = Math.sign(this.vspeed);
            while (!this.place_meeting(this.x, this.y + sign, 'obj_wall')) {
                this.y += sign;
            }
            this.vspeed = 0;
        }
        // Timer-based direction change
        this.directionTimer--;
        if (this.directionTimer <= 0) {
            this.moveDirection *= -1;
            this.directionTimer = this.directionChangeTime;
        }
    }
}
