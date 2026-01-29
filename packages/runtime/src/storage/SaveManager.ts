/**
 * Manages game save/load functionality using localStorage
 */
export class SaveManager {
    private storagePrefix: string = 'origami_game_';

    constructor(gameId: string = 'default') {
        this.storagePrefix = `origami_game_${gameId}_`;
    }

    /**
     * Save data to a slot
     */
    save(slot: string | number, data: any): boolean {
        try {
            const key = this.getKey(slot);
            const json = JSON.stringify(data);
            localStorage.setItem(key, json);
            return true;
        } catch (error) {
            console.error('Failed to save game:', error);
            return false;
        }
    }

    /**
     * Load data from a slot
     */
    load(slot: string | number): any | null {
        try {
            const key = this.getKey(slot);
            const json = localStorage.getItem(key);

            if (json === null) {
                return null;
            }

            return JSON.parse(json);
        } catch (error) {
            console.error('Failed to load game:', error);
            return null;
        }
    }

    /**
     * Check if a save exists in a slot
     */
    exists(slot: string | number): boolean {
        const key = this.getKey(slot);
        return localStorage.getItem(key) !== null;
    }

    /**
     * Delete a save from a slot
     */
    delete(slot: string | number): boolean {
        try {
            const key = this.getKey(slot);
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Failed to delete save:', error);
            return false;
        }
    }

    /**
     * Get all save slots
     */
    getAllSlots(): string[] {
        const slots: string[] = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(this.storagePrefix)) {
                const slot = key.substring(this.storagePrefix.length);
                slots.push(slot);
            }
        }

        return slots;
    }

    /**
     * Clear all saves
     */
    clearAll(): boolean {
        try {
            const slots = this.getAllSlots();
            for (const slot of slots) {
                this.delete(slot);
            }
            return true;
        } catch (error) {
            console.error('Failed to clear saves:', error);
            return false;
        }
    }

    /**
     * Get the storage key for a slot
     */
    private getKey(slot: string | number): string {
        return `${this.storagePrefix}${slot}`;
    }
}

/**
 * Initialize global save/load functions
 */
export function initializeSaveGlobals(saveManager: SaveManager): void {
    const g = globalThis as any;

    g.game_save = function (slot: string | number): boolean {
        // User should define what to save
        // This is just a simple example
        const saveData = {
            timestamp: Date.now(),
            // Add custom data here
        };

        return saveManager.save(slot, saveData);
    };

    g.game_load = function (slot: string | number): boolean {
        const data = saveManager.load(slot);
        if (data === null) {
            return false;
        }

        // User should define how to load data
        // This is just a simple example
        return true;
    };

    g.game_save_exists = function (slot: string | number): boolean {
        return saveManager.exists(slot);
    };

    g.game_save_delete = function (slot: string | number): boolean {
        return saveManager.delete(slot);
    };
}
