/**
 * GMS-style virtual key constants
 */
export const vk_nokey = 0;
export const vk_anykey = 1;
export const vk_left = 37;
export const vk_right = 39;
export const vk_up = 38;
export const vk_down = 40;
export const vk_enter = 13;
export const vk_escape = 27;
export const vk_space = 32;
export const vk_shift = 16;
export const vk_control = 17;
export const vk_alt = 18;
export const vk_backspace = 8;
export const vk_tab = 9;
export const vk_home = 36;
export const vk_end = 35;
export const vk_delete = 46;
export const vk_insert = 45;
export const vk_pageup = 33;
export const vk_pagedown = 34;
export const vk_pause = 19;
export const vk_printscreen = 44;

// Function keys
export const vk_f1 = 112;
export const vk_f2 = 113;
export const vk_f3 = 114;
export const vk_f4 = 115;
export const vk_f5 = 116;
export const vk_f6 = 117;
export const vk_f7 = 118;
export const vk_f8 = 119;
export const vk_f9 = 120;
export const vk_f10 = 121;
export const vk_f11 = 122;
export const vk_f12 = 123;

// Numpad
export const vk_numpad0 = 96;
export const vk_numpad1 = 97;
export const vk_numpad2 = 98;
export const vk_numpad3 = 99;
export const vk_numpad4 = 100;
export const vk_numpad5 = 101;
export const vk_numpad6 = 102;
export const vk_numpad7 = 103;
export const vk_numpad8 = 104;
export const vk_numpad9 = 105;
export const vk_multiply = 106;
export const vk_divide = 111;
export const vk_add = 107;
export const vk_subtract = 109;
export const vk_decimal = 110;

// Letter keys (A-Z)
export const vk_a = 65;
export const vk_b = 66;
export const vk_c = 67;
export const vk_d = 68;
export const vk_e = 69;
export const vk_f = 70;
export const vk_g = 71;
export const vk_h = 72;
export const vk_i = 73;
export const vk_j = 74;
export const vk_k = 75;
export const vk_l = 76;
export const vk_m = 77;
export const vk_n = 78;
export const vk_o = 79;
export const vk_p = 80;
export const vk_q = 81;
export const vk_r = 82;
export const vk_s = 83;
export const vk_t = 84;
export const vk_u = 85;
export const vk_v = 86;
export const vk_w = 87;
export const vk_x = 88;
export const vk_y = 89;
export const vk_z = 90;

/**
 * Manages keyboard input state
 */
export class KeyboardManager {
    private keysDown: Set<number> = new Set();
    private keysPressed: Set<number> = new Set();
    private keysReleased: Set<number> = new Set();

    constructor() {
        this.setupEventListeners();
    }

    /**
     * Set up keyboard event listeners
     */
    private setupEventListeners(): void {
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));

        // Prevent default browser behavior for game keys
        window.addEventListener('keydown', (e) => {
            // Prevent arrow keys from scrolling
            if ([37, 38, 39, 40, 32].includes(e.keyCode)) {
                e.preventDefault();
            }
        });
    }

    /**
     * Handle key down event
     */
    private handleKeyDown(e: KeyboardEvent): void {
        const keyCode = e.keyCode;

        if (!this.keysDown.has(keyCode)) {
            this.keysPressed.add(keyCode);
        }

        this.keysDown.add(keyCode);
    }

    /**
     * Handle key up event
     */
    private handleKeyUp(e: KeyboardEvent): void {
        const keyCode = e.keyCode;
        this.keysDown.delete(keyCode);
        this.keysReleased.add(keyCode);
    }

    /**
     * Check if a key is currently held down
     */
    check(key: number): boolean {
        if (key === vk_anykey) {
            return this.keysDown.size > 0;
        }
        return this.keysDown.has(key);
    }

    /**
     * Check if a key was just pressed this frame
     */
    checkPressed(key: number): boolean {
        if (key === vk_anykey) {
            return this.keysPressed.size > 0;
        }
        return this.keysPressed.has(key);
    }

    /**
     * Check if a key was just released this frame
     */
    checkReleased(key: number): boolean {
        if (key === vk_anykey) {
            return this.keysReleased.size > 0;
        }
        return this.keysReleased.has(key);
    }

    /**
     * Clear pressed and released states (called at end of frame)
     */
    clearFrameStates(): void {
        this.keysPressed.clear();
        this.keysReleased.clear();
    }
}
