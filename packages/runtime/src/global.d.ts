/**
 * Global type declarations for Origami Engine runtime functions
 * These functions are injected into the global scope by GameEngine
 */

import type { GameObject } from './core/GameObject.js';

declare global {
    // Instance management
    function instance_create<T extends GameObject>(
        x: number,
        y: number,
        objectType: string | (new () => T)
    ): Promise<T>;

    function instance_destroy(this: GameObject): void;

    function instance_find<T extends GameObject>(
        objectType: string | (new () => T),
        n: number
    ): T | null;

    function instance_exists(objectType: string | (new () => GameObject)): boolean;

    function instance_number(objectType: string | (new () => GameObject)): number;

    function instance_place<T extends GameObject>(
        x: number,
        y: number,
        objectType: string | (new () => T)
    ): T | null;

    // Collision
    function place_meeting(
        x: number,
        y: number,
        objectType: string | (new () => GameObject)
    ): boolean;

    // Room management
    function room_goto(roomName: string): Promise<void>;

    // Drawing functions
    function draw_self(this: GameObject): void;
    function draw_sprite(sprite: string, subimg: number, x: number, y: number): void;
    function draw_sprite_ext(
        sprite: string,
        subimg: number,
        x: number,
        y: number,
        xscale: number,
        yscale: number,
        angle: number,
        color: string,
        alpha: number
    ): void;
    function draw_text(x: number, y: number, text: string): void;
    function draw_rectangle(x1: number, y1: number, x2: number, y2: number, outline: boolean): void;
    function draw_circle(x: number, y: number, radius: number, outline: boolean): void;
    function draw_line(x1: number, y1: number, x2: number, y2: number): void;
    function draw_set_color(color: string): void;
    function draw_set_alpha(alpha: number): void;
    function draw_set_font(font: string): void;
    function draw_set_halign(align: 'left' | 'center' | 'right'): void;
    function draw_set_valign(align: 'top' | 'middle' | 'bottom'): void;

    // Input - Keyboard
    function keyboard_check(key: number): boolean;
    function keyboard_check_pressed(key: number): boolean;
    function keyboard_check_released(key: number): boolean;

    // Input - Mouse
    function mouse_check_button(button: number): boolean;
    function mouse_check_button_pressed(button: number): boolean;
    function mouse_check_button_released(button: number): boolean;

    // Math and utility
    function random(n: number): number;
    function irandom(n: number): number;
    function random_range(min: number, max: number): number;
    function choose<T>(...args: T[]): T;
    function lengthdir_x(length: number, direction: number): number;
    function lengthdir_y(length: number, direction: number): number;
    function point_direction(x1: number, y1: number, x2: number, y2: number): number;
    function point_distance(x1: number, y1: number, x2: number, y2: number): number;
    function clamp(value: number, min: number, max: number): number;
    function lerp(a: number, b: number, t: number): number;

    // Storage
    function game_save(slot: string): void;
    function game_load(slot: string): any;

    // Debug
    function show_debug_message(this: GameObject, message: string): void;

    // Global variables (read-only game state)
    var room_width: number;
    var room_height: number;
    var room_speed: number;
    var mouse_x: number;
    var mouse_y: number;
    var view_xview: number;
    var view_yview: number;
    var view_wview: number;
    var view_hview: number;
}

export { };
