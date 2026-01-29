import type { RoomDefinition, ViewConfig, BackgroundConfig } from './RoomTypes.js';

/**
 * Represents a game room
 */
export class Room {
    name: string;
    width: number;
    height: number;
    speed: number;
    backgroundColor: string;
    views: ViewConfig[];
    backgrounds: BackgroundConfig[];

    constructor(definition: RoomDefinition) {
        this.name = definition.name;
        this.width = definition.width;
        this.height = definition.height;
        this.speed = definition.speed;
        this.backgroundColor = definition.backgroundColor;

        // Initialize views
        this.views = definition.views || [this.createDefaultView()];

        // Initialize backgrounds
        this.backgrounds = definition.backgrounds || [];
    }

    /**
     * Create a default view
     */
    private createDefaultView(): ViewConfig {
        return {
            enabled: true,
            xview: 0,
            yview: 0,
            wview: this.width,
            hview: this.height,
            xport: 0,
            yport: 0,
            wport: this.width,
            hport: this.height,
            hborder: 0,
            vborder: 0,
            hspeed: -1,
            vspeed: -1,
            object: null,
        };
    }

    /**
     * Get the active view (view[0])
     */
    getView(): ViewConfig {
        return this.views[0];
    }

    /**
     * Update view to follow target object
     */
    updateView(targetX: number, targetY: number): void {
        const view = this.getView();
        if (!view.enabled) return;

        // Calculate center of view
        const viewCenterX = view.xview + view.wview / 2;
        const viewCenterY = view.yview + view.hview / 2;

        // Calculate borders (deadzone)
        const leftBorder = view.xview + view.hborder;
        const rightBorder = view.xview + view.wview - view.hborder;
        const topBorder = view.yview + view.vborder;
        const bottomBorder = view.yview + view.hview - view.vborder;

        // Move view if target is outside deadzone
        let newXView = view.xview;
        let newYView = view.yview;

        if (targetX < leftBorder) {
            newXView = targetX - view.hborder;
        } else if (targetX > rightBorder) {
            newXView = targetX - view.wview + view.hborder;
        }

        if (targetY < topBorder) {
            newYView = targetY - view.vborder;
        } else if (targetY > bottomBorder) {
            newYView = targetY - view.hview + view.vborder;
        }

        // Clamp to room bounds
        newXView = Math.max(0, Math.min(newXView, this.width - view.wview));
        newYView = Math.max(0, Math.min(newYView, this.height - view.hview));

        view.xview = newXView;
        view.yview = newYView;
    }
}
