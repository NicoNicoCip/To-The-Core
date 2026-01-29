/// <reference path="../node_modules/origami-runtime/src/global.d.ts" />
import { GameObject, vk_a, vk_d, vk_space } from 'origami-runtime';

export class obj_player extends GameObject {
    private moveSpeed: number = 4;
    private jumpSpeed: number = 12;
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
        if (this.hspeed !== 0 && this.place_meeting(this.x + this.hspeed, this.y, 'obj_wall')) {
            // Push out of collision
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

        // Check if on ground
        this.onGround = this.place_meeting(this.x, this.y + 1, 'obj_wall');

        // Jumping
        if (this.onGround && keyboard_check_pressed(vk_space)) {
            this.vspeed = -this.jumpSpeed;
        }

        // Check for vertical collision
        if (this.vspeed !== 0 && this.place_meeting(this.x, this.y + this.vspeed, 'obj_wall')) {
            // Push out of collision
            const sign = Math.sign(this.vspeed);
            while (!this.place_meeting(this.x, this.y + sign, 'obj_wall')) {
                this.y += sign;
            }
            this.vspeed = 0;
        }

        // Check for collectibles
        const collectible = this.instance_place(this.x, this.y, 'obj_collectible') as any;
        if (collectible && collectible.collect) {
            collectible.collect();
            console.log('Collected item!');
        }
    }
}
