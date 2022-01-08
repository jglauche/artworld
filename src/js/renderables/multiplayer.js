import { Text, Entity, Sprite, Rect, game, level, input, collision } from 'melonjs/dist/melonjs.module.js';
import TextRenderer from 'js/renderables/text_renderer.js';
import MapEntry from 'js/renderables/map_entry.js';
import {Socket, Manager, io} from "socket.io-client";

class MultiPlayer extends Entity {
  constructor(x, y, settings) {
      settings.width = 32;
      settings.height = 32;

      let img = settings.image;
      let sid = settings.sid;
      super(x, y , settings);
      // max walking & jumping speed
      this.nick = settings.nick;
      this.image = img;
      let s = false;
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
      console.log(this.nick, x,y,settings.z);
      this.text = new Text(1, 1, {
        font : "PressStart2P",
        size : 18,
        textBaseline : "center",
        textAlign : "left",
        fillStyle: "#420f42",
        text : this.nick,
        offScreenCanvas: false,
        anchorPoint: { x: 0.5, y: 0.5 }
      });
      this.anchorPoint = {x: 0.5, y: 0.5 };
      this.text.pos.x = x + this.width/2.0;
      this.text.pos.y = y;
      game.world.addChild(this.text, settings.z);


      settings.socket.on("move", ([socketid, x, y]) => {
          if (this.sid == socketid){
            this.move(x,y);
          }
      });


     // console.log("player was created");
  }

  move(x,y){
    console.log(this);
    this.pos.x = x;
    this.pos.y = y;
    this.text.pos.x = x + this.width/2.0;
    this.text.pos.y = y;
  }

  clientUpdate(settings){
    [image, nick] = settings;
    this.image = image;
    this.nick = nick;
    this.text.setText(nick);
  }

  update(dt) {
      return (super.update(dt));
  }


  onDestroyEvent(){
    game.world.removeChild(this.text);
//    console.log("player was destroyed");
  }


};

export default MultiPlayer;
