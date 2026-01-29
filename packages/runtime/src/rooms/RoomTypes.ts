/**
 * Instance definition in room JSON
 */
export interface RoomInstance {
    object: string;
    x: number;
    y: number;
    creationCode?: string;
}

/**
 * View configuration
 */
export interface ViewConfig {
    enabled: boolean;
    xview: number;
    yview: number;
    wview: number;
    hview: number;
    xport: number;
    yport: number;
    wport: number;
    hport: number;
    hborder: number;
    vborder: number;
    hspeed: number;
    vspeed: number;
    object: string | null;
}

/**
 * Background configuration
 */
export interface BackgroundConfig {
    image: string | null;
    visible: boolean;
    x: number;
    y: number;
    htiled: boolean;
    vtiled: boolean;
    hspeed: number;
    vspeed: number;
}

/**
 * Room definition from JSON
 */
export interface RoomDefinition {
    name: string;
    width: number;
    height: number;
    speed: number;
    backgroundColor: string;
    instances: RoomInstance[];
    views?: ViewConfig[];
    backgrounds?: BackgroundConfig[];
}
