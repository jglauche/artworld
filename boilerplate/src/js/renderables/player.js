import { Entity, Rect, game, input, collision } from 'melonjs/dist/melonjs.module.js';

class PlayerEntity extends Entity {

    /**
     * constructor
     */
    constructor(x, y, settings) {
        // call the parent constructor
        super(x, y , settings);
        // max walking & jumping speed
        this.body.setMaxVelocity(4.2, 4.2);
        this.body.setFriction(0.1, 0.1);
        this.body.force.set(0, 0);
        this.body.addShape(new Rect(0, 0, this.width, this.height));
        this.body.ignoreGravity = true;

        this.alwaysUpdate = true;
        this.renderable.addAnimation("walk",  [0, 1, 2, 3, 4, 5, 6, 7]);
        this.renderable.addAnimation("stand",  [0]);
        this.renderable.setCurrentAnimation("stand");
        // this.body.collisionType = collision.types.PLAYER_OBJECT;
        game.viewport.follow(this.pos, game.viewport.AXIS.BOTH, 0.4);
    }

    /**
     * update the entity
     */
    update(dt) {
        var keypress = 0;
        if (input.isKeyPressed('left')) {
            keypress = 1;
            // flip the sprite on horizontal axis
            this.renderable.flipX(true);
            // update the default force
            this.body.force.x = -this.body.maxVel.x;
            // change to the walking animation
            if (!this.renderable.isCurrentAnimation("walk")) {
                this.renderable.setCurrentAnimation("walk");
            }
        } else if (input.isKeyPressed('right')) {
            keypress = 1;
            // unflip the sprite
            this.renderable.flipX(false);
            // update the entity velocity
            this.body.force.x = this.body.maxVel.x;
            // change to the walking animation
            if (!this.renderable.isCurrentAnimation("walk")) {
                this.renderable.setCurrentAnimation("walk");
            }
        }
        if (input.isKeyPressed('up')) {
            keypress = 1;
            // flip the sprite on horizontal axis
            this.renderable.flipY(false);
            // update the default force
            this.body.force.y = -this.body.maxVel.y;
            // change to the walking animation
            if (!this.renderable.isCurrentAnimation("walk")) {
                this.renderable.setCurrentAnimation("walk");
            }
        } else if (input.isKeyPressed('down')) {
            keypress = 1;
            // unflip the sprite
            this.renderable.flipY(false);
            // update the entity velocity
            this.body.force.y = this.body.maxVel.y;
            // change to the walking animation
            if (!this.renderable.isCurrentAnimation("walk")) {
                this.renderable.setCurrentAnimation("walk");
            }
        }

        if (keypress == 0){
            this.body.force.x = 0;
            this.body.force.y = 0;
            // change to the standing animation
            this.renderable.setCurrentAnimation("stand");
        }

        return (super.update(dt) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    }


   /**
     * colision handler
     * (called when colliding with other objects)
     */
    onCollision(response, other) {
        // Make all other objects solid
        return true;
    }
};

export default PlayerEntity;
