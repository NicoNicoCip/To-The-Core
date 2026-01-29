/**
 * Sprite metadata structure
 */
export interface SpriteMetadata {
    origin: {
        x: number;
        y: number;
    };
    fps: number;
    frames?: number; // Optional: number of frames (default: 1, only frame_0)
    bbox?: {
        left: number;
        top: number;
        right: number;
        bottom: number;
    };
}

/**
 * A single sprite frame
 */
export interface SpriteFrame {
    image: HTMLImageElement;
    width: number;
    height: number;
}

/**
 * Complete sprite data
 */
export interface Sprite {
    name: string;
    frames: SpriteFrame[];
    metadata: SpriteMetadata;
    width: number;
    height: number;
}
