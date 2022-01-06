import { Entity, Sprite, Rect, game, level, input, collision } from 'melonjs/dist/melonjs.module.js';
import {Socket, Manager, io} from "socket.io-client";
import TextRenderer from 'js/renderables/text_renderer.js';
import MapEntry from 'js/renderables/map_entry.js';
import MultiPlayer from 'js/renderables/multiplayer.js';

class PlayerEntity extends Entity {
    constructor(x, y, settings) {
        settings.width = 16;
        settings.height = 32;
        settings.image = "sample_character_06";
        let img = settings.image;

        super(x, y , settings);
        // max walking & jumping speed
        this.image = img;
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
        game.viewport.follow(this.pos, game.viewport.AXIS.BOTH, 0.4);
        this.level = level.getCurrentLevelId();
        this.last_x = this.pos.x;
        this.last_y = this.pos.y;
//        this.manager = new Manager('http://localhost:3000/');
        //this.socket = this.manager.socket("/"+this.level);
        this.socket = io("http://localhost:3000");
        this.socket.emit("levelChange", this.level);

        this.socket.on("infoReq", () => {
          this.socket.emit("clientInfo", [this.level, this.image, this.pos.x, this.pos.y, this.pos.x]);
        });

        this.socket.on("clientUpdate", settings => this.handleClientUpdate(settings));
        this.socket.on("disconnectEvent", settings => this.handleClientDisconnect(settings));

       // console.log("player was created");
    }
    /**
     * update the entity
     */
    update(dt) {
        var keypress = 0;
        if (input.isKeyPressed('debug')){
          this.socket.emit("msg", "beep");

          keypress = 1;
          console.log(this);
        }
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
        if (this.last_x != this.pos.x || this.last_y != this.pos.y){
          this.last_x = this.pos.x;
          this.last_y = this.pos.y;
          this.socket.emit("move", [this.level, this.pos.x, this.pos.y]);
        }
        return (super.update(dt) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
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
            }
            // assume wall otherwise
            return true;
      }
      return false;
    }

  handleClientUpdate(settings){
    let [sid, level, image, x, y, z] = settings;

    let found = false;
    game.world.getChildByType(MultiPlayer).forEach(mp => {
      if (mp.sid == sid){
        if (this.level != level){
            game.world.removeChild(mp);
          } else {
            found = true;
          }
      }
    });
    if (found == false && this.level == level){
      console.log("spawning new multiplayer");
      let mp = new MultiPlayer(x, y, {image: image, sid: sid, socket: this.socket});
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
    this.socket.disconnect();
    console.log("player was destroyed");
  }


};

export default PlayerEntity;
