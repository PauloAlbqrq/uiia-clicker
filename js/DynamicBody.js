import {Node} from "./Node.js"
import {Vector2} from "./Game.js"
import { StaticBody } from "./StaticBody.js";
import { CollisionBox } from "./CollisionBox.js";

export class DynamicBody extends Node {
    constructor() {
        super();
        this.vel = new Vector2()
    }

    update() {
        super.update()

        this.pos = this.pos.add(this.vel)

        for (const obj of this.getAllNodes(this.getRoot())) {
            if (obj === this) continue; // don't collide with self
            if (obj instanceof StaticBody || obj instanceof DynamicBody) {
                for (const myBox of this.children) {
                    if (myBox instanceof CollisionBox) {
                        for (const otherBox of obj.children) {
                            if (otherBox instanceof CollisionBox) {
                                if (myBox.intersects(otherBox)) {
                                    this.resolveCollision(myBox, otherBox);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    resolveCollision(myBox, otherBox) {
        const a = myBox.getAABB();
        const b = otherBox.getAABB();

        const overlapX = (a.x + a.w / 2) - (b.x + b.w / 2);
        const overlapY = (a.y + a.h / 2) - (b.y + b.h / 2);
        const halfW = (a.w + b.w) / 2;
        const halfH = (a.h + b.h) / 2;

        if (Math.abs(overlapX) < halfW && Math.abs(overlapY) < halfH) {
            const penX = halfW - Math.abs(overlapX);
            const penY = halfH - Math.abs(overlapY);

            if (penX < penY) {
                this.pos.x += overlapX > 0 ? penX : -penX;
                this.vel.x = 0;
            } else {
                this.pos.y += overlapY > 0 ? penY : -penY;
                this.vel.y = 0;
            }
        }
    }
}