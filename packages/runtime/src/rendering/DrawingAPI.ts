import type { GameEngine } from '../core/GameEngine.js';

/**
 * Initialize the drawing API with global functions
 */
export function initializeDrawingAPI(engine: GameEngine): void {
    const g = globalThis as any;
    const ctx = engine.getRenderer().getContext();
    const renderer = engine.getRenderer();

    /**
     * Draw a sprite
     */
    g.draw_sprite = function (sprite: string, subimg: number, x: number, y: number): void {
        const spriteData = engine.getSpriteManager().getSprite(sprite);
        if (!spriteData || spriteData.frames.length === 0) {
            // Draw placeholder
            drawMissingSprite(ctx, x, y, 32, 32);
            return;
        }

        const frameIndex = Math.floor(subimg) % spriteData.frames.length;
        const frame = spriteData.frames[frameIndex];
        const origin = spriteData.metadata.origin;

        ctx.drawImage(frame.image, x - origin.x, y - origin.y);
    };

    /**
     * Draw self (current instance sprite)
     */
    g.draw_self = function (): void {
        // This will be called in context of GameObject
        const instance = (this as any);

        if (!instance.sprite_index) return;

        const spriteData = engine.getSpriteManager().getSprite(instance.sprite_index);
        if (!spriteData || spriteData.frames.length === 0) {
            drawMissingSprite(ctx, 0, 0, 32, 32);
            return;
        }

        const frameIndex = Math.floor(instance.image_index) % spriteData.frames.length;
        const frame = spriteData.frames[frameIndex];
        const origin = spriteData.metadata.origin;

        // Transform is already applied by InstanceManager
        ctx.drawImage(frame.image, -origin.x, -origin.y);
    };

    /**
     * Draw text
     */
    g.draw_text = function (x: number, y: number, text: string): void {
        ctx.save();
        ctx.fillStyle = renderer.getColor();
        ctx.globalAlpha = renderer.getAlpha();
        ctx.font = renderer.getFont();
        ctx.fillText(String(text), x, y);
        ctx.restore();
    };

    /**
     * Draw rectangle
     */
    g.draw_rectangle = function (
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        outline: boolean
    ): void {
        ctx.save();
        ctx.fillStyle = renderer.getColor();
        ctx.strokeStyle = renderer.getColor();
        ctx.globalAlpha = renderer.getAlpha();

        if (outline) {
            ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
        } else {
            ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
        }

        ctx.restore();
    };

    /**
     * Draw circle
     */
    g.draw_circle = function (x: number, y: number, radius: number, outline: boolean): void {
        ctx.save();
        ctx.fillStyle = renderer.getColor();
        ctx.strokeStyle = renderer.getColor();
        ctx.globalAlpha = renderer.getAlpha();

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);

        if (outline) {
            ctx.stroke();
        } else {
            ctx.fill();
        }

        ctx.restore();
    };

    /**
     * Set drawing color
     */
    g.draw_set_color = function (color: string): void {
        renderer.setColor(color);
    };

    /**
     * Set drawing alpha
     */
    g.draw_set_alpha = function (alpha: number): void {
        renderer.setAlpha(alpha);
    };

    /**
     * Draw sprite with extended options (scale, rotation, color, alpha)
     */
    g.draw_sprite_ext = function (
        sprite: string,
        subimg: number,
        x: number,
        y: number,
        xscale: number,
        yscale: number,
        angle: number,
        color: string,
        alpha: number
    ): void {
        const spriteData = engine.getSpriteManager().getSprite(sprite);
        if (!spriteData || spriteData.frames.length === 0) {
            drawMissingSprite(ctx, x, y, 32, 32);
            return;
        }

        const frameIndex = Math.floor(subimg) % spriteData.frames.length;
        const frame = spriteData.frames[frameIndex];
        const origin = spriteData.metadata.origin;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(x, y);
        ctx.rotate((angle * Math.PI) / 180);
        ctx.scale(xscale, yscale);
        ctx.drawImage(frame.image, -origin.x, -origin.y);
        ctx.restore();
    };

    /**
     * Draw a line
     */
    g.draw_line = function (x1: number, y1: number, x2: number, y2: number): void {
        ctx.save();
        ctx.strokeStyle = renderer.getColor();
        ctx.globalAlpha = renderer.getAlpha();
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.restore();
    };

    /**
     * Set font for text drawing
     */
    g.draw_set_font = function (font: string): void {
        renderer.setFont(font);
    };

    /**
     * Set horizontal text alignment
     */
    g.draw_set_halign = function (align: 'left' | 'center' | 'right'): void {
        ctx.textAlign = align;
    };

    /**
     * Set vertical text alignment
     */
    g.draw_set_valign = function (align: 'top' | 'middle' | 'bottom'): void {
        const alignMap = { top: 'top', middle: 'middle', bottom: 'bottom' };
        ctx.textBaseline = alignMap[align] as CanvasTextBaseline;
    };

    /**
     * Helper to draw missing sprite placeholder
     */
    function drawMissingSprite(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        width: number,
        height: number
    ): void {
        const tileSize = 8;

        for (let ty = 0; ty < height; ty += tileSize) {
            for (let tx = 0; tx < width; tx += tileSize) {
                const isEven = ((tx / tileSize) + (ty / tileSize)) % 2 === 0;
                ctx.fillStyle = isEven ? '#FF00FF' : '#000000';
                ctx.fillRect(x + tx, y + ty, tileSize, tileSize);
            }
        }
    }
}
