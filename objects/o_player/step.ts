// Player movement and physics

// Horizontal movement
let move = 0;
if (keyboard_check(vk_left)) {
    move = -1;
}
if (keyboard_check(vk_right)) {
    move = 1;
}

// Apply horizontal velocity
const move_speed = 4;
this.hspeed = move * move_speed;

// Apply gravity
this.vspeed += 0.5;

// Limit fall speed
if (this.vspeed > 15) {
    this.vspeed = 15;
}

// Check if on ground
const on_ground = this.place_meeting(this.x, this.y + this.vspeed, o_wall);

// Jumping
if (keyboard_check_pressed(vk_space) && on_ground) {
    this.vspeed = -10;
}

// Horizontal collision
if (this.place_meeting(this.x + this.hspeed, this.y, o_wall)) {
    while (!this.place_meeting(this.x + sign(this.hspeed), this.y, o_wall)) {
        this.x += sign(this.hspeed);
    }
    this.hspeed = 0;
}
this.x += this.hspeed;

// Vertical collision
if (this.place_meeting(this.x, this.y + this.vspeed, o_wall)) {
    while (!this.place_meeting(this.x, this.y + sign(this.vspeed), o_wall)) {
        this.y += sign(this.vspeed);
    }
    this.vspeed = 0;
}
this.y += this.vspeed;

// Collect coins - check if we're touching any coin
if (this.place_meeting(this.x, this.y, o_coin)) {
    // Find and destroy the nearest coin
    const coin = instance.instance_nearest(this.x, this.y, o_coin);
    if (coin) {
        coin.instance_destroy();
        // Could add score here
    }
}

// Check if hit enemy
if (this.place_meeting(this.x, this.y, o_enemy)) {
    // Reset to start position
    this.x = 64;
    this.y = 64;
}

// Helper function for sign
function sign(value: number): number {
    if (value > 0) return 1;
    if (value < 0) return -1;
    return 0;
}
