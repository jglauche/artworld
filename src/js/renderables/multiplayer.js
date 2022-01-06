import { Entity, Sprite, Rect, game, level, input, collision } from 'melonjs/dist/melonjs.module.js';
import TextRenderer from 'js/renderables/text_renderer.js';
import MapEntry from 'js/renderables/map_entry.js';
import {Socket, Manager, io} from "socket.io-client";

class MultiPlayer extends Entity {
  constructor(x, y, settings) {
      settings.width = 16;
      settings.height = 32;

      let img = settings.image;
      let sid = settings.sid;
      super(x, y , settings);
      // max walking & jumping speed
      this.image = img;
      this.sid = sid;
      this.body.setMaxVelocity(8.0, 8.0);
      this.body.setFriction(1,1);
      this.body.force.set(0, 0);
      this.body.addShape(new Rect(0, 0, this.width, this.height));
      this.body.ignoreGravity = true;

      this.alwaysUpdate = true;
      this.renderable.addAnimation("walk",  [1, 5, 9]);
      this.renderable.addAnimation("stand",  [1]);
      this.renderable.setCurrentAnimation("stand");
      this.body.collisionType = collision.types.PLAYER_OBJECT;
      this.body.setCollisionMask(
          collision.types.WORLD_SHAPE
      );

      settings.socket.on("move", ([socketid, x, y]) => {
          if (this.sid == socketid){
            this.move(x,y);
          }
      });


     // console.log("player was created");
  }

  move(x,y){
    this.pos.x = x;
    this.pos.y = y;
  }
  /**
   * update the entity
   */
  update(dt) {
      return (super.update(dt));
  }


  onDestroyEvent(){
//    console.log("player was destroyed");
  }


};

export default MultiPlayer;
