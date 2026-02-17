// Simple enemy AI - patrol back and forth

// Apply gravity
this.vspeed += 0.5;
if (this.vspeed > 15) {
    this.vspeed = 15;
}

// Move horizontally
this.hspeed = this.move_direction * 2;

// Check for walls or ledges ahead
const wall_ahead = this.place_meeting(this.x + this.hspeed * 2, this.y, o_wall);
const ledge_ahead = !this.place_meeting(this.x + this.hspeed * 8, this.y + 16, o_wall);

// Turn around if hitting wall or ledge
if (wall_ahead || ledge_ahead) {
    this.move_direction *= -1;
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

// Helper function
function sign(value: number): number {
    if (value > 0) return 1;
    if (value < 0) return -1;
    return 0;
}
