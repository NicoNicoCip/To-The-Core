import type { GameEngine } from '../core/GameEngine.js';

/**
 * Manages rendering to the canvas
 */
export class Renderer {
    private engine: GameEngine;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    // Drawing state
    private currentColor: string = '#FFFFFF';
    private currentAlpha: number = 1.0;
    private currentFont: string = '12px Arial';

    constructor(engine: GameEngine, canvas: HTMLCanvasElement) {
        this.engine = engine;
        this.canvas = canvas;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Failed to get 2D context from canvas');
        }
        this.ctx = ctx;

        // Set up canvas scaling
        this.setupCanvas();
    }

    /**
     * Set up canvas to scale to window
     */
    private setupCanvas(): void {
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    /**
     * Resize the canvas to fit the current room
     */
    resizeCanvas(): void {
        const room = this.engine.getRoomManager().getCurrentRoom();
        if (!room) return;

        const view = room.getView();

        // Calculate scale to fit window while maintaining aspect ratio
        const scaleX = window.innerWidth / view.wview;
        const scaleY = window.innerHeight / view.hview;
        const scale = Math.min(scaleX, scaleY);

        // Set canvas size
        this.canvas.width = view.wview;
        this.canvas.height = view.hview;

        // Set display size
        this.canvas.style.width = `${view.wview * scale}px`;
        this.canvas.style.height = `${view.hview * scale}px`;
    }

    /**
     * Get the canvas
     */
    getCanvas(): HTMLCanvasElement {
        return this.canvas;
    }

    /**
     * Get the rendering context
     */
    getContext(): CanvasRenderingContext2D {
        return this.ctx;
    }

    /**
     * Clear the canvas
     */
    clear(color: string): void {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Begin rendering a frame
     */
    beginFrame(): void {
        const room = this.engine.getRoomManager().getCurrentRoom();
        if (!room) return;

        // Clear with background color
        this.clear(room.backgroundColor);

        // Draw backgrounds
        this.drawBackgrounds();

        // Reset drawing state
        this.currentColor = '#FFFFFF';
        this.currentAlpha = 1.0;
        this.ctx.globalAlpha = 1.0;
    }

    /**
     * Draw backgrounds
     */
    private drawBackgrounds(): void {
        const room = this.engine.getRoomManager().getCurrentRoom();
        if (!room) return;

        const view = room.getView();

        for (const bg of room.backgrounds) {
            if (!bg.visible || !bg.image) continue;

            const sprite = this.engine.getSpriteManager().getSprite(bg.image);
            if (!sprite || sprite.frames.length === 0) continue;

            const image = sprite.frames[0].image;

            if (bg.htiled || bg.vtiled) {
                // Tiled background
                const startX = bg.htiled ? Math.floor((view.xview + bg.x) / sprite.width) * sprite.width - bg.x - view.xview : bg.x - view.xview;
                const startY = bg.vtiled ? Math.floor((view.yview + bg.y) / sprite.height) * sprite.height - bg.y - view.yview : bg.y - view.yview;
                const endX = bg.htiled ? this.canvas.width : startX + sprite.width;
                const endY = bg.vtiled ? this.canvas.height : startY + sprite.height;

                for (let x = startX; x < endX; x += sprite.width) {
                    for (let y = startY; y < endY; y += sprite.height) {
                        this.ctx.drawImage(image, x, y);
                    }
                }
            } else {
                // Single background
                this.ctx.drawImage(image, bg.x - view.xview, bg.y - view.yview);
            }
        }
    }

    /**
     * Render a frame
     */
    render(): void {
        this.beginFrame();

        const room = this.engine.getRoomManager().getCurrentRoom();
        if (room) {
            const view = room.getView();

            // Translate context for view
            this.ctx.save();
            this.ctx.translate(-view.xview, -view.yview);

            // Draw all instances
            this.engine.getInstanceManager().drawInstances(this.ctx);

            this.ctx.restore();
        }

        // Draw debug overlay
        if (this.engine.isDebugMode()) {
            this.engine.getDebugManager().draw(this.ctx);
        }
    }

    /**
     * Set drawing color
     */
    setColor(color: string): void {
        this.currentColor = color;
    }

    /**
     * Set drawing alpha
     */
    setAlpha(alpha: number): void {
        this.currentAlpha = Math.max(0, Math.min(1, alpha));
    }

    /**
     * Get current color
     */
    getColor(): string {
        return this.currentColor;
    }

    /**
     * Get current alpha
     */
    getAlpha(): number {
        return this.currentAlpha;
    }

    /**
     * Set font
     */
    setFont(font: string): void {
        this.currentFont = font;
    }

    /**
     * Get current font
     */
    getFont(): string {
        return this.currentFont;
    }
}
