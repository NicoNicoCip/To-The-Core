import type { GameEngine } from '../core/GameEngine.js';

/**
 * Initialize global input functions
 */
export function initializeInputGlobals(engine: GameEngine): void {
    const g = globalThis as any;

    // ===== Keyboard Functions =====

    g.keyboard_check = function (key: number): boolean {
        return engine.getKeyboardManager().check(key);
    };

    g.keyboard_check_pressed = function (key: number): boolean {
        return engine.getKeyboardManager().checkPressed(key);
    };

    g.keyboard_check_released = function (key: number): boolean {
        return engine.getKeyboardManager().checkReleased(key);
    };

    // ===== Mouse Functions =====

    g.mouse_check_button = function (button: number): boolean {
        return engine.getMouseManager().check(button);
    };

    g.mouse_check_button_pressed = function (button: number): boolean {
        return engine.getMouseManager().checkPressed(button);
    };

    g.mouse_check_button_released = function (button: number): boolean {
        return engine.getMouseManager().checkReleased(button);
    };

    // ===== Mouse Position Variables =====
    Object.defineProperty(g, 'mouse_x', {
        get: () => engine.getMouseManager().x,
        configurable: true,
    });

    Object.defineProperty(g, 'mouse_y', {
        get: () => engine.getMouseManager().y,
        configurable: true,
    });
}
