import type { GameObject } from '../core/GameObject.js';
import type { GameEngine } from '../core/GameEngine.js';

/**
 * Bounding box structure
 */
export interface BBox {
    left: number;
    top: number;
    right: number;
    bottom: number;
}

/**
 * Manages collision detection between game objects
 */
export class CollisionManager {
    private engine: GameEngine;

    constructor(engine: GameEngine) {
        this.engine = engine;
    }

    /**
     * Get the bounding box for an instance
     */
    getBBox(instance: GameObject): BBox {
        if (!instance.sprite_index) {
            // No sprite - use point collision
            return {
                left: instance.x,
                top: instance.y,
                right: instance.x,
                bottom: instance.y,
            };
        }

        const sprite = this.engine.getSpriteManager().getSprite(instance.sprite_index);
        if (!sprite) {
            return {
                left: instance.x,
                top: instance.y,
                right: instance.x,
                bottom: instance.y,
            };
        }

        // Use custom bbox if defined in metadata
        if (sprite.metadata.bbox) {
            const bbox = sprite.metadata.bbox;
            return {
                left: instance.x + bbox.left * instance.image_xscale,
                top: instance.y + bbox.top * instance.image_yscale,
                right: instance.x + bbox.right * instance.image_xscale,
                bottom: instance.y + bbox.bottom * instance.image_yscale,
            };
        }

        // Auto-calculate from sprite dimensions with origin offset
        const origin = sprite.metadata.origin;
        const width = sprite.width * instance.image_xscale;
        const height = sprite.height * instance.image_yscale;

        return {
            left: instance.x - origin.x * instance.image_xscale,
            top: instance.y - origin.y * instance.image_yscale,
            right: instance.x - origin.x * instance.image_xscale + width,
            bottom: instance.y - origin.y * instance.image_yscale + height,
        };
    }

    /**
     * Check if two bounding boxes overlap
     */
    bboxOverlap(bbox1: BBox, bbox2: BBox): boolean {
        return !(
            bbox1.right <= bbox2.left ||
            bbox1.left >= bbox2.right ||
            bbox1.bottom <= bbox2.top ||
            bbox1.top >= bbox2.bottom
        );
    }

    /**
     * Check if a point is inside a bounding box
     */
    pointInBBox(x: number, y: number, bbox: BBox): boolean {
        return x >= bbox.left && x < bbox.right && y >= bbox.top && y < bbox.bottom;
    }

    /**
     * Get the bounding box for an instance at a specific position
     */
    getBBoxAtPosition(instance: GameObject, x: number, y: number): BBox {
        const offset_x = x - instance.x;
        const offset_y = y - instance.y;
        const bbox = this.getBBox(instance);

        return {
            left: bbox.left + offset_x,
            top: bbox.top + offset_y,
            right: bbox.right + offset_x,
            bottom: bbox.bottom + offset_y,
        };
    }

    /**
     * Check collision between an instance at a position and a list of instances
     */
    checkCollisionAtPosition(
        instance: GameObject,
        x: number,
        y: number,
        targets: GameObject[]
    ): GameObject | null {
        const bbox = this.getBBoxAtPosition(instance, x, y);

        for (const target of targets) {
            if (target === instance || target.isDestroyed()) continue;

            const targetBBox = this.getBBox(target);
            if (this.bboxOverlap(bbox, targetBBox)) {
                return target;
            }
        }

        return null;
    }

    /**
     * Check collision between a rectangle and instances
     */
    checkRectangleCollision(
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        targets: GameObject[]
    ): GameObject | null {
        const rect: BBox = {
            left: Math.min(x1, x2),
            top: Math.min(y1, y2),
            right: Math.max(x1, x2),
            bottom: Math.max(y1, y2),
        };

        for (const target of targets) {
            if (target.isDestroyed()) continue;

            const targetBBox = this.getBBox(target);
            if (this.bboxOverlap(rect, targetBBox)) {
                return target;
            }
        }

        return null;
    }

    /**
     * Check collision at a point
     */
    checkPointCollision(x: number, y: number, targets: GameObject[]): GameObject | null {
        for (const target of targets) {
            if (target.isDestroyed()) continue;

            const targetBBox = this.getBBox(target);
            if (this.pointInBBox(x, y, targetBBox)) {
                return target;
            }
        }

        return null;
    }

    /**
     * Get all instances colliding with an instance at a position
     */
    getAllCollisionsAtPosition(
        instance: GameObject,
        x: number,
        y: number,
        targets: GameObject[]
    ): GameObject[] {
        const bbox = this.getBBoxAtPosition(instance, x, y);
        const collisions: GameObject[] = [];

        for (const target of targets) {
            if (target === instance || target.isDestroyed()) continue;

            const targetBBox = this.getBBox(target);
            if (this.bboxOverlap(bbox, targetBBox)) {
                collisions.push(target);
            }
        }

        return collisions;
    }
}
