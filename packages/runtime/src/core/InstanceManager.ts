import type { GameObject } from './GameObject.js';
import type { GameEngine } from './GameEngine.js';

/**
 * Manages all game object instances
 */
export class InstanceManager {
    private engine: GameEngine;
    private instances: GameObject[] = [];
    private objectRegistry: Map<string, new () => GameObject> = new Map();
    private instancesToDestroy: GameObject[] = [];

    constructor(engine: GameEngine) {
        this.engine = engine;
    }

    /**
     * Register an object class
     */
    registerObjectClass(objectType: string, objectClass: new () => GameObject): void {
        this.objectRegistry.set(objectType, objectClass);
    }

    /**
     * Create a new instance of an object
     */
    async createInstance(objectType: string, x: number, y: number): Promise<GameObject> {
        const ObjectClass = this.objectRegistry.get(objectType);

        if (!ObjectClass) {
            throw new Error(`Object type not registered: ${objectType}`);
        }

        // Create instance
        const instance = new ObjectClass();
        instance.setEngine(this.engine);

        // Set position
        instance.x = x;
        instance.y = y;
        instance.xstart = x;
        instance.ystart = y;

        // Add to instances list
        this.instances.push(instance);

        // Call create event
        instance.create();

        return instance;
    }

    /**
     * Destroy an instance
     */
    destroyInstance(instance: GameObject): void {
        if (!instance.isDestroyed()) {
            instance.markDestroyed();
            this.instancesToDestroy.push(instance);
        }
    }

    /**
     * Remove destroyed instances from the list
     */
    cleanupDestroyedInstances(): void {
        if (this.instancesToDestroy.length === 0) return;

        // Remove destroyed instances
        this.instances = this.instances.filter((inst) => !inst.isDestroyed());
        this.instancesToDestroy = [];
    }

    /**
     * Get all instances
     */
    getAllInstances(): GameObject[] {
        return this.instances.filter((inst) => !inst.isDestroyed());
    }

    /**
     * Get instances of a specific type
     */
    getInstancesOfType(objectType: string): GameObject[] {
        return this.instances.filter(
            (inst) => !inst.isDestroyed() && inst.objectType === objectType
        );
    }

    /**
     * Check if any instance of a type exists
     */
    instanceExists(objectType: string): boolean {
        return this.instances.some(
            (inst) => !inst.isDestroyed() && inst.objectType === objectType
        );
    }

    /**
     * Count instances of a type
     */
    instanceCount(objectType: string): number {
        return this.instances.filter(
            (inst) => !inst.isDestroyed() && inst.objectType === objectType
        ).length;
    }

    /**
     * Find the nth instance of a type
     */
    instanceFind(objectType: string, n: number): GameObject | null {
        const instances = this.getInstancesOfType(objectType);
        return instances[n] || null;
    }

    /**
     * Get instance by ID
     */
    getInstanceById(id: string): GameObject | null {
        return this.instances.find((inst) => !inst.isDestroyed() && inst.id === id) || null;
    }

    /**
     * Sort instances by depth and order
     */
    sortInstances(): void {
        this.instances.sort((a, b) => {
            // First sort by depth (higher depth = drawn later = appears behind)
            if (a.depth !== b.depth) {
                return b.depth - a.depth;
            }
            // Then by order
            return a.order - b.order;
        });
    }

    /**
     * Update all instances
     */
    updateInstances(): void {
        // Sort by order for step execution
        const sortedInstances = [...this.instances]
            .filter((inst) => !inst.isDestroyed())
            .sort((a, b) => a.order - b.order);

        for (const instance of sortedInstances) {
            if (!instance.isDestroyed()) {
                // Update motion
                instance.updateMotion();

                // Call step event
                instance.step();
            }
        }

        // Clean up destroyed instances
        this.cleanupDestroyedInstances();
    }

    /**
     * Draw all instances
     */
    drawInstances(ctx: CanvasRenderingContext2D): void {
        // Sort by depth for rendering
        this.sortInstances();

        for (const instance of this.instances) {
            if (!instance.isDestroyed() && instance.visible) {
                // Update animation
                instance.updateAnimation();

                // Save context state
                ctx.save();

                // Apply transformations
                ctx.translate(instance.x, instance.y);
                ctx.rotate((instance.image_angle * Math.PI) / 180);
                ctx.scale(instance.image_xscale, instance.image_yscale);
                ctx.globalAlpha = instance.image_alpha;

                // Call draw event
                instance.draw();

                // Restore context state
                ctx.restore();
            }
        }
    }

    /**
     * Clear all instances
     */
    clearAllInstances(): void {
        this.instances = [];
        this.instancesToDestroy = [];
    }
}
