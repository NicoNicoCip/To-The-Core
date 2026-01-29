import type { GameEngine } from './GameEngine.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Base class for all game objects in Origami Engine.
 * Extend this class and override methods like create(), step(), draw()
 * to define custom game object behavior.
 */
export abstract class GameObject {
    // Instance identification
    readonly id: string = uuidv4();
    readonly objectType: string;

    // Position and movement
    x: number = 0;
    y: number = 0;
    xprevious: number = 0;
    yprevious: number = 0;
    xstart: number = 0;
    ystart: number = 0;

    speed: number = 0;
    direction: number = 0;
    hspeed: number = 0;
    vspeed: number = 0;

    // Sprite and animation
    sprite_index: string | null = null;
    image_index: number = 0;
    image_speed: number = 1;
    image_alpha: number = 1;
    image_angle: number = 0;
    image_xscale: number = 1;
    image_yscale: number = 1;

    // Visibility and depth
    visible: boolean = true;
    depth: number = 0;

    // Execution order
    order: number = 0;

    // Reference to engine
    protected engine!: GameEngine;

    // Flags
    persistent: boolean = false;
    private _destroyed: boolean = false;

    constructor() {
        // Get the object type from the class name
        this.objectType = this.constructor.name;
    }

    /**
     * Called when the instance is created
     */
    create(): void { }

    /**
     * Called every frame to update game logic
     */
    step(): void { }

    /**
     * Called every frame to render the instance
     * Default implementation automatically draws the sprite
     */
    draw(): void {
        // Auto-draw sprite if sprite_index is set and draw() is not overridden
        if (this.sprite_index) {
            const g = globalThis as any;
            if (g.draw_self) {
                g.draw_self.call(this);
            }
        }
    }

    /**
     * Called when the game starts
     */
    gameStart(): void { }

    /**
     * Called when the game ends
     */
    gameEnd(): void { }

    /**
     * Called when entering a room
     */
    roomStart(): void { }

    /**
     * Called when leaving a room
     */
    roomEnd(): void { }

    /**
     * Set the engine reference (called internally)
     */
    setEngine(engine: GameEngine): void {
        this.engine = engine;
    }

    /**
     * Check if this instance has been destroyed
     */
    isDestroyed(): boolean {
        return this._destroyed;
    }

    /**
     * Mark this instance as destroyed (called internally)
     */
    markDestroyed(): void {
        this._destroyed = true;
    }

    /**
     * Update built-in motion system
     * Called automatically before step()
     */
    updateMotion(): void {
        // Store previous position
        this.xprevious = this.x;
        this.yprevious = this.y;

        // Update hspeed/vspeed from speed/direction
        if (this.speed !== 0) {
            const lengthdir_x = (len: number, dir: number) => len * Math.cos((dir * Math.PI) / 180);
            const lengthdir_y = (len: number, dir: number) => -len * Math.sin((dir * Math.PI) / 180);

            this.hspeed = lengthdir_x(this.speed, this.direction);
            this.vspeed = lengthdir_y(this.speed, this.direction);
        }

        // Apply motion
        this.x += this.hspeed;
        this.y += this.vspeed;
    }

    /**
     * Update sprite animation
     * Called automatically before draw()
     */
    updateAnimation(): void {
        if (this.sprite_index && this.image_speed !== 0) {
            this.image_index += this.image_speed;

            // Get sprite frame count
            const sprite = this.engine.getSpriteManager().getSprite(this.sprite_index);
            if (sprite) {
                const frameCount = sprite.frames.length;

                // Loop animation
                if (this.image_index >= frameCount) {
                    this.image_index = this.image_index % frameCount;
                } else if (this.image_index < 0) {
                    this.image_index = (frameCount + (this.image_index % frameCount)) % frameCount;
                }
            }
        }
    }

    // Collision helper methods
    place_meeting(x: number, y: number, objectType: string): boolean {
        const targets = this.engine.getInstanceManager().getInstancesOfType(objectType);
        const collision = this.engine.getCollisionManager().checkCollisionAtPosition(this, x, y, targets);
        return collision !== null;
    }

    instance_place(x: number, y: number, objectType: string): GameObject | null {
        const targets = this.engine.getInstanceManager().getInstancesOfType(objectType);
        return this.engine.getCollisionManager().checkCollisionAtPosition(this, x, y, targets);
    }

    // Instance management helper
    instance_destroy(): void {
        this.engine.getInstanceManager().destroyInstance(this);
    }
}
