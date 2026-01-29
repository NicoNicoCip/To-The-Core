/// <reference path="../node_modules/origami-runtime/src/global.d.ts" />
import { GameObject } from 'origami-runtime';

export class obj_wall extends GameObject {
    create(): void {
        this.sprite_index = 'spr_wall';
    }
}
