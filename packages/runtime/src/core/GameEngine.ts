import { GameObject } from './GameObject.js';
import { InstanceManager } from './InstanceManager.js';
import { SpriteManager } from '../sprites/SpriteManager.js';
import { KeyboardManager } from '../input/KeyboardManager.js';
import { MouseManager } from '../input/MouseManager.js';
import { CollisionManager } from '../collision/CollisionManager.js';
import { RoomManager } from '../rooms/RoomManager.js';
import { Renderer } from '../rendering/Renderer.js';
import { SaveManager, initializeSaveGlobals } from '../storage/SaveManager.js';
import { DebugManager } from '../debug/DebugManager.js';
import { initializeGlobalFunctions, updateGlobalViewVariables } from '../globals/GlobalFunctions.js';
import { initializeInputGlobals } from '../globals/InputGlobals.js';
import { initializeDrawingAPI } from '../rendering/DrawingAPI.js';

/**
 * Game configuration
 */
export interface GameConfig {
    canvas: HTMLCanvasElement;
    assetsPath: string;
    gameId?: string;
    startRoom?: string;
}

/**
 * Main game engine class
 */
export class GameEngine {
    private config: GameConfig;
    private running: boolean = false;
    private canvas: HTMLCanvasElement;

    // Managers
    private instanceManager: InstanceManager;
    private spriteManager: SpriteManager;
    private keyboardManager: KeyboardManager;
    private mouseManager: MouseManager;
    private collisionManager: CollisionManager;
    private roomManager: RoomManager;
    private renderer: Renderer;
    private saveManager: SaveManager;
    private debugManager: DebugManager;

    // Game loop
    private lastFrameTime: number = 0;
    private targetFrameTime: number = 1000 / 60; // 60 FPS
    private animationFrameId: number | null = null;

    // Lifecycle flags
    private gameStarted: boolean = false;

    constructor(config: GameConfig) {
        this.config = config;
        this.canvas = config.canvas;

        // Initialize managers
        this.instanceManager = new InstanceManager(this);
        this.spriteManager = new SpriteManager();
        this.keyboardManager = new KeyboardManager();
        this.mouseManager = new MouseManager(this.canvas);
        this.collisionManager = new CollisionManager(this);
        this.roomManager = new RoomManager(this);
        this.renderer = new Renderer(this, this.canvas);
        this.saveManager = new SaveManager(config.gameId);
        this.debugManager = new DebugManager(this);

        // Initialize global functions
        this.initializeGlobals();
    }

    /**
     * Initialize global functions
     */
    private initializeGlobals(): void {
        initializeGlobalFunctions(this);
        initializeInputGlobals(this);
        initializeDrawingAPI(this);
        initializeSaveGlobals(this.saveManager);

        // Export keyboard and mouse constants
        this.exportInputConstants();
    }

    /**
     * Export input constants to global scope
     */
    private exportInputConstants(): void {
        const g = globalThis as any;

        // Keyboard constants
        g.vk_nokey = 0;
        g.vk_anykey = 1;
        g.vk_left = 37;
        g.vk_right = 39;
        g.vk_up = 38;
        g.vk_down = 40;
        g.vk_enter = 13;
        g.vk_escape = 27;
        g.vk_space = 32;
        g.vk_shift = 16;
        g.vk_control = 17;
        g.vk_alt = 18;
        g.vk_backspace = 8;
        g.vk_tab = 9;
        g.vk_home = 36;
        g.vk_end = 35;
        g.vk_delete = 46;
        g.vk_insert = 45;
        g.vk_pageup = 33;
        g.vk_pagedown = 34;
        g.vk_pause = 19;
        g.vk_printscreen = 44;
        g.vk_f1 = 112;
        g.vk_f2 = 113;
        g.vk_f3 = 114;
        g.vk_f4 = 115;
        g.vk_f5 = 116;
        g.vk_f6 = 117;
        g.vk_f7 = 118;
        g.vk_f8 = 119;
        g.vk_f9 = 120;
        g.vk_f10 = 121;
        g.vk_f11 = 122;
        g.vk_f12 = 123;
        g.vk_numpad0 = 96;
        g.vk_numpad1 = 97;
        g.vk_numpad2 = 98;
        g.vk_numpad3 = 99;
        g.vk_numpad4 = 100;
        g.vk_numpad5 = 101;
        g.vk_numpad6 = 102;
        g.vk_numpad7 = 103;
        g.vk_numpad8 = 104;
        g.vk_numpad9 = 105;
        g.vk_multiply = 106;
        g.vk_divide = 111;
        g.vk_add = 107;
        g.vk_subtract = 109;
        g.vk_decimal = 110;
        g.vk_a = 65;
        g.vk_b = 66;
        g.vk_c = 67;
        g.vk_d = 68;
        g.vk_e = 69;
        g.vk_f = 70;
        g.vk_g = 71;
        g.vk_h = 72;
        g.vk_i = 73;
        g.vk_j = 74;
        g.vk_k = 75;
        g.vk_l = 76;
        g.vk_m = 77;
        g.vk_n = 78;
        g.vk_o = 79;
        g.vk_p = 80;
        g.vk_q = 81;
        g.vk_r = 82;
        g.vk_s = 83;
        g.vk_t = 84;
        g.vk_u = 85;
        g.vk_v = 86;
        g.vk_w = 87;
        g.vk_x = 88;
        g.vk_y = 89;
        g.vk_z = 90;

        // Mouse constants
        g.mb_left = 0;
        g.mb_right = 2;
        g.mb_middle = 1;
    }

    /**
     * Register a game object class
     */
    registerObject(objectClass: new () => GameObject): void {
        const instance = new objectClass();
        this.instanceManager.registerObjectClass(instance.objectType, objectClass);
    }

    /**
     * Load game configuration from game.json
     */
    async loadGameConfig(configPath: string): Promise<void> {
        const response = await fetch(configPath);
        if (!response.ok) {
            throw new Error(`Failed to load game config: ${configPath}`);
        }

        const config = await response.json();

        // Preload all sprites listed in game.json
        if (config.sprites) {
            const basePath = this.config.assetsPath + '/sprites';
            for (const spriteName of config.sprites) {
                try {
                    await this.spriteManager.loadSprite(basePath, spriteName);
                } catch (error) {
                    console.warn(`Failed to load sprite: ${spriteName}`, error);
                }
            }
        }

        // Register objects (assuming they're already imported and available)
        if (config.objects) {
            for (const objectPath of config.objects) {
                // Objects need to be registered by the game code
                // This is just to document the expected structure
            }
        }

        // Load rooms
        if (config.rooms) {
            for (const roomName of config.rooms) {
                await this.roomManager.loadRoomDefinition(
                    this.config.assetsPath + '/rooms',
                    roomName
                );
            }
        }
    }

    /**
     * Start the game
     */
    async start(startRoom?: string): Promise<void> {
        if (this.running) {
            console.warn('Game is already running');
            return;
        }

        this.running = true;

        // Go to start room
        const roomToLoad = startRoom || this.config.startRoom;
        if (roomToLoad) {
            await this.roomManager.gotoRoom(roomToLoad);
        }

        // Call game start on all instances
        if (!this.gameStarted) {
            const instances = this.instanceManager.getAllInstances();
            for (const instance of instances) {
                instance.gameStart();
            }
            this.gameStarted = true;
        }

        // Start game loop
        this.lastFrameTime = performance.now();
        this.gameLoop(this.lastFrameTime);
    }

    /**
     * Main game loop
     */
    private gameLoop(currentTime: number): void {
        if (!this.running) return;

        const deltaTime = currentTime - this.lastFrameTime;

        // Fixed timestep: only update if enough time has passed
        if (deltaTime >= this.targetFrameTime) {
            // Update
            this.update(deltaTime);

            // Render
            this.render();

            // Update last frame time
            this.lastFrameTime = currentTime - (deltaTime % this.targetFrameTime);
        }

        // Schedule next frame
        this.animationFrameId = requestAnimationFrame((time) => this.gameLoop(time));
    }

    /**
     * Update game state
     */
    private update(deltaTime: number): void {
        // Update instances
        this.instanceManager.updateInstances();

        // Update view following
        this.updateViewFollowing();

        // Update global view variables
        updateGlobalViewVariables(this);

        // Update debug manager
        this.debugManager.update(deltaTime);

        // Clear frame input states
        this.keyboardManager.clearFrameStates();
        this.mouseManager.clearFrameStates();
    }

    /**
     * Update view to follow target object
     */
    private updateViewFollowing(): void {
        const room = this.roomManager.getCurrentRoom();
        if (!room) return;

        const view = room.getView();
        if (!view.enabled || !view.object) return;

        // Find the target object
        const targets = this.instanceManager.getInstancesOfType(view.object);
        if (targets.length === 0) return;

        const target = targets[0];
        room.updateView(target.x, target.y);
    }

    /**
     * Render the game
     */
    private render(): void {
        this.renderer.render();
    }

    /**
     * Stop the game
     */
    stop(): void {
        this.running = false;

        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }

        // Call game end on all instances
        const instances = this.instanceManager.getAllInstances();
        for (const instance of instances) {
            instance.gameEnd();
        }
    }

    /**
     * Restart the game
     */
    restart(): void {
        this.stop();

        // Clear all instances
        this.instanceManager.clearAllInstances();

        // Reset game started flag
        this.gameStarted = false;

        // Restart
        this.start(this.config.startRoom);
    }

    /**
     * Check if debug mode is enabled
     */
    isDebugMode(): boolean {
        return this.debugManager.isEnabled();
    }

    // ===== Getters =====

    getConfig(): GameConfig {
        return this.config;
    }

    getInstanceManager(): InstanceManager {
        return this.instanceManager;
    }

    getSpriteManager(): SpriteManager {
        return this.spriteManager;
    }

    getKeyboardManager(): KeyboardManager {
        return this.keyboardManager;
    }

    getMouseManager(): MouseManager {
        return this.mouseManager;
    }

    getCollisionManager(): CollisionManager {
        return this.collisionManager;
    }

    getRoomManager(): RoomManager {
        return this.roomManager;
    }

    getRenderer(): Renderer {
        return this.renderer;
    }

    getSaveManager(): SaveManager {
        return this.saveManager;
    }

    getDebugManager(): DebugManager {
        return this.debugManager;
    }
}
