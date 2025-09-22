import Node from "./Node.js"
import {Vector2} from "./Utils.js"
import StaticBody from "./StaticBody.js";
import CollisionBox from "./CollisionBox.js";

export default class DynamicBody extends Node {
    constructor() {
        super();
        this.vel = new Vector2()
	this.speed = 1
    }

    update() {
        super.update()

        this.pos = this.pos.add(this.vel.scale(this.speed))

        const collisions = [];
        for (const obj of this.getAllNodes(this.getRoot())) {
        if (obj === this) continue;
        if (obj instanceof StaticBody || obj instanceof DynamicBody) {
            for (const myBox of this.children) {
                if (myBox instanceof CollisionBox) {
                    for (const otherBox of obj.children) {
                        if (otherBox instanceof CollisionBox) {
                            if (myBox.intersects(otherBox)) {
                                collisions.push({
                                    myBox: myBox,
                                    otherBox: otherBox
                                });
                            }
                        }
                    }
                }
            }
        }
    }
        for (const collision of collisions) {
            this.resolveCollision(collision.myBox, collision.otherBox);
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
        
        // Horizontal Collision
        if (Math.abs(penX) < Math.abs(penY)) {
            // Adjust position
            if (overlapX > 0) {
                this.pos.x += penX;
            } else {
                this.pos.x -= penX;
            }
            // Reset velocity
            this.vel.x = 0;
        } 
        
        // Vertical Collision
        if (Math.abs(penY) < Math.abs(penX)) {
            // Adjust position
            if (overlapY > 0) {
                this.pos.y += penY;
            } else {
                this.pos.y -= penY;
            }
            // Reset velocity
            this.vel.y = 0;
        }
    }
}
}
