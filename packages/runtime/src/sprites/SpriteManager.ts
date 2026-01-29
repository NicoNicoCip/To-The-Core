import type { Sprite, SpriteFrame, SpriteMetadata } from './SpriteTypes.js';

/**
 * Manages loading and storage of sprite assets
 */
export class SpriteManager {
    private sprites: Map<string, Sprite> = new Map();
    private loadingPromises: Map<string, Promise<Sprite>> = new Map();

    /**
     * Load a sprite from a folder
     * @param basePath Base path to sprites folder
     * @param spriteName Name of the sprite (folder name)
     */
    async loadSprite(basePath: string, spriteName: string): Promise<Sprite> {
        // Check if already loaded
        if (this.sprites.has(spriteName)) {
            return this.sprites.get(spriteName)!;
        }

        // Check if already loading
        if (this.loadingPromises.has(spriteName)) {
            return this.loadingPromises.get(spriteName)!;
        }

        // Start loading
        const loadPromise = this._loadSpriteInternal(basePath, spriteName);
        this.loadingPromises.set(spriteName, loadPromise);

        try {
            const sprite = await loadPromise;
            this.sprites.set(spriteName, sprite);
            return sprite;
        } finally {
            this.loadingPromises.delete(spriteName);
        }
    }

    /**
     * Internal sprite loading logic
     */
    private async _loadSpriteInternal(basePath: string, spriteName: string): Promise<Sprite> {
        const spritePath = `${basePath}/${spriteName}`;

        // Load metadata
        const metadataResponse = await fetch(`${spritePath}/metadata.json`);
        if (!metadataResponse.ok) {
            throw new Error(`Failed to load metadata for sprite: ${spriteName}`);
        }
        const metadata: SpriteMetadata = await metadataResponse.json();

        // Load frames
        const frames: SpriteFrame[] = [];

        // Determine how many frames to load (default to 1 if not specified)
        const frameCount = metadata.frames ?? 1;

        // Load all frames
        for (let i = 0; i < frameCount; i++) {
            try {
                const frame = await this._loadFrame(spritePath, i);
                frames.push(frame);
            } catch (error) {
                if (i === 0) {
                    // Frame 0 is required
                    throw new Error(`No frames found for sprite: ${spriteName}`);
                } else {
                    // Additional frames are optional - warn but continue
                    console.warn(`Frame ${i} not found for sprite: ${spriteName}, stopping at ${frames.length} frames`);
                    break;
                }
            }
        }

        // Calculate sprite dimensions (use first frame)
        const width = frames[0].width;
        const height = frames[0].height;

        return {
            name: spriteName,
            frames,
            metadata,
            width,
            height,
        };
    }

    /**
     * Load a single frame
     */
    private async _loadFrame(spritePath: string, frameIndex: number): Promise<SpriteFrame> {
        // Try different extensions
        const extensions = ['.png', '.jpg', '.webp'];

        for (const ext of extensions) {
            const framePath = `${spritePath}/frame_${frameIndex}${ext}`;

            try {
                const image = await this._loadImage(framePath);
                return {
                    image,
                    width: image.width,
                    height: image.height,
                };
            } catch {
                // Try next extension
                continue;
            }
        }

        throw new Error(`Frame ${frameIndex} not found`);
    }

    /**
     * Load an image
     */
    private _loadImage(src: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => {
                // Silently reject without logging - this is expected when trying different formats
                reject(new Error(`Failed to load image: ${src}`));
            };
            img.src = src;
        });
    }

    /**
     * Get a loaded sprite
     */
    getSprite(name: string): Sprite | undefined {
        return this.sprites.get(name);
    }

    /**
     * Check if a sprite is loaded
     */
    hasSprite(name: string): boolean {
        return this.sprites.has(name);
    }

    /**
     * Get all loaded sprite names
     */
    getSpriteNames(): string[] {
        return Array.from(this.sprites.keys());
    }

    /**
     * Preload multiple sprites
     */
    async preloadSprites(basePath: string, spriteNames: string[]): Promise<void> {
        await Promise.all(spriteNames.map((name) => this.loadSprite(basePath, name)));
    }
}
