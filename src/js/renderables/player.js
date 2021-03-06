import { Text, Entity, Sprite, Rect, game, level, input, collision } from 'melonjs/dist/melonjs.module.js';
import {Socket, Manager, io} from "socket.io-client";
import TextRenderer from 'js/renderables/text_renderer.js';
import MapEntry from 'js/renderables/map_entry.js';
import MultiPlayer from 'js/renderables/multiplayer.js';

class PlayerEntity extends Entity {
    constructor(x, y, settings) {
        settings.width = 32;
        settings.height = 32;

        let i = document.getElementById("character").value;
        if (i != ""){
          settings.image = i;
        } else {
          settings.image = "Cat 01-1r";
        }
        let img = settings.image;

        super(x, y , settings);
        // max walking & jumping speed
        this.image = img;
        this.nick = document.getElementById('name').value;
        this.text = new Text(1, 1, {
          font : "PressStart2P",
          size : 18,
          textBaseline : "center",
          textAlign : "left",
          fillStyle: "#ffffff",
          text : this.nick,
          offScreenCanvas: false,
          anchorPoint: { x: 0.5, y: 0.5 }
        });

        this.text.pos.x = x + this.width/2.0;
        this.text.pos.y = y;
        game.world.addChild(this.text, settings.z);

        this.walk_x = null;
        this.walk_y = null;
        this.stopped = false;
        this.stuck = false;

        this.body.setMaxVelocity(8.0, 8.0);
        this.body.setFriction(1,1);
        this.body.force.set(0, 0);
        this.body.addShape(new Rect(0, 0, this.width, this.height));
        this.body.ignoreGravity = true;

        this.alwaysUpdate = true;
        this.renderable.addAnimation("walk-down",  [0, 1, 2]);
        this.renderable.addAnimation("walk-left",  [3, 4, 5]);
        this.renderable.addAnimation("walk-right",  [6, 7, 8]);
        this.renderable.addAnimation("walk-up",  [9, 10, 11]);

        this.renderable.addAnimation("stand",  [1]);

        this.renderable.setCurrentAnimation("stand");
        this.body.collisionType = collision.types.PLAYER_OBJECT;
        this.body.setCollisionMask(
            collision.types.WORLD_SHAPE
        );
        game.viewport.follow(this.pos, game.viewport.AXIS.BOTH, 0.4);
        this.level = level.getCurrentLevelId();
        this.last_x = this.pos.x;
        this.last_y = this.pos.y;
        this.socket = io(process.env.artserver);
        this.socket.emit("levelChange", this.level);

        this.socket.on("infoReq", () => {
          this.socket.emit("clientInfo", [this.level, this.image, this.pos.x, this.pos.y, settings.z, this.nick]);
        });

        this.socket.on("clientUpdate", settings => this.handleClientUpdate(settings));
        this.socket.on("disconnectEvent", settings => this.handleClientDisconnect(settings));
        input.registerPointerEvent("pointerdown", game.viewport, this.onMouseDown.bind(this));
        input.setTouchAction(document.getElementsByTagName("canvas")[0], 'auto');


       // console.log("player was created");
    }
    /**
     * update the entity
     */
    update(dt) {
      var keypress = 0;
      if (input.isKeyPressed('debug')){
        console.log(this);
      }

      if (input.isKeyPressed('left') || input.isKeyPressed('right') || input.isKeyPressed('up') || input.isKeyPressed('down')){
        this.move_x = null;
        this.move_y = null;
      }
      let mx = 0;
      let my = 0;

      if (this.stopped == false){
        if (this.move_x != null){
          let vec_x = this.move_x - this.pos.x;
          if (Math.abs(vec_x) < 10){
            this.pos.x = this.move_x;
            this.move_x = null;
            this.body.force.x = 0;
          } else {
            if (vec_x < 0){
              mx += 1;
            } else {
              mx -= 1;
            }
          }
        }

        if (this.move_y != null){
          let vec_y = this.move_y - this.pos.y;
          if (Math.abs(vec_y) < 10){
            this.pos.y = this.move_y;
            this.move_y = null;
            this.body.force.y = 0;
          } else {
            if (vec_y < 0){
              my += 1;
            } else {
              my -= 1;
            }
          }
        }
      }
//      console.log(input.isKeyPressed('left'), input.isKeyPressed('right'), input.isKeyPressed('up'), input.isKeyPressed('down'), mx, my);
      if (input.isKeyPressed('left') || mx > 0) {
        keypress = 1;
        // flip the sprite on horizontal axis
        this.renderable.flipX(false);
        // update the default force
        this.body.force.x = -this.body.maxVel.x;
        // change to the walking animation
        if (!this.renderable.isCurrentAnimation("walk-left")) {
          this.renderable.setCurrentAnimation("walk-left");
        }
      } else if (input.isKeyPressed('right') || mx < 0) {
        keypress = 1;
        // unflip the sprite
        this.renderable.flipX(false);
        // update the entity velocity
        this.body.force.x = this.body.maxVel.x;
        // change to the walking animation
        if (!this.renderable.isCurrentAnimation("walk-right")) {
          this.renderable.setCurrentAnimation("walk-right");
        }
      }
      if (input.isKeyPressed('up') || my > 0) {
          keypress = 1;
          // flip the sprite on horizontal axis
          this.renderable.flipY(false);
          // update the default force
          this.body.force.y = -this.body.maxVel.y;
          // change to the walking animation
          if (!this.renderable.isCurrentAnimation("walk-up")) {
              this.renderable.setCurrentAnimation("walk-up");
          }
      } else if (input.isKeyPressed('down') || my < 0) {
        keypress = 1;
        // unflip the sprite
        this.renderable.flipY(false);
        // update the entity velocity
        this.body.force.y = this.body.maxVel.y;
        // change to the walking animation
        if (!this.renderable.isCurrentAnimation("walk-down")) {
          this.renderable.setCurrentAnimation("walk-down");
        }
      }
      if (keypress == 0 && mx == 0 && my == 0){
        this.stop();
      }
      if (this.last_x != this.pos.x || this.last_y != this.pos.y){
        this.stuck = false;
        this.last_x = this.pos.x;
        this.last_y = this.pos.y;
        this.text.pos.x = this.pos.x + this.width/2.0;
        this.text.pos.y = this.pos.y;
        this.socket.emit("move", [this.level, this.pos.x, this.pos.y]);
      }

      return (super.update(dt) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    }

    stop(){
      this.body.force.x = 0;
      this.body.force.y = 0;
      // change to the standing animation
      this.renderable.setCurrentAnimation("stand");
    }

    stopMove(){
      this.move_x = null;
      this.move_y = null;
      this.stopped = true;
      this.stuck = true;
    }

    onMouseDown(pos){
      this.stopped = false;
      this.move_x = pos.gameX;
      this.move_y = pos.gameY;
      // console.log(this.pos.x, this.move_x, " x ", this.pos.y, this.move_y);
    }


   /**
     * colision handler
     * (called when colliding with other objects)
     */
  onCollision(res, other) {
    switch (res.b.body.collisionType) {
      case collision.types.WORLD_SHAPE:
        // console.log(other.name);
        switch (other.name){
          case "text":
            document.getElementById("title").innerHTML = other.stext;
            document.getElementById("description").innerHTML = "";
            document.getElementById("link").innerHTML = "";
            document.getElementById("author").innerHTML = "";
            document.getElementById("license").innerHTML = "";
            document.getElementById("surface").innerHTML = "";
            document.getElementById("size").innerHTML = "";
            return false;
          case "artwork":
            document.getElementById("title").innerHTML = other.stext;
            document.getElementById("description").innerHTML = other.description;
            document.getElementById("link").innerHTML = other.link;
            document.getElementById("author").innerHTML = other.author;
            document.getElementById("license").innerHTML = other.license;
            document.getElementById("surface").innerHTML = other.surface;
            document.getElementById("size").innerHTML = other.size;
            return false;
          default:
            this.stop();
            if (!this.stuck){
              this.stopMove();
            }
            return true;
          }
    }
    return false;
  }

  handleClientUpdate(settings){
    let [sid, level, image, x, y, z, nick] = settings;

    let found = false;
    game.world.getChildByType(MultiPlayer).forEach(mp => {
      if (mp.sid == sid){
        if (this.level != level){
          game.world.removeChild(mp);
        } else {
          found = true;
          mp.clientUpdate([image, nick]);
        }
      }
    });
   // console.log(found);
    if (found == false && this.level == level){
      console.log("spawning new multiplayer");
      let mp = new MultiPlayer(x, y, {nick: nick, image: image, sid: sid, socket: this.socket, z: z});
      game.world.addChild(mp, z);

    }
  }

  handleClientDisconnect(settings){
    let [sid] = settings;
    console.log("disconnect event got");
    game.world.getChildByType(MultiPlayer).forEach(mp => {
      if (mp.sid == sid){
        console.log("removing player");
        game.world.removeChild(mp);
      }
    });
  }

  onDestroyEvent(){
    input.releasePointerEvent('pointerdown', game.viewport);
    game.world.removeChild(this.text);
    this.socket.disconnect();
    console.log("player was destroyed");
  }


};

export default PlayerEntity;
