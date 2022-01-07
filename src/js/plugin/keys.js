import * as me from 'melonjs/dist/melonjs.module.js';

const gameKeys = new Map();
gameKeys.set(me.input.KEY.D, "right");
gameKeys.set(me.input.KEY.RIGHT, "right");
gameKeys.set(me.input.KEY.A, "left");
gameKeys.set(me.input.KEY.LEFT, "left");
gameKeys.set(me.input.KEY.W, "up");
gameKeys.set(me.input.KEY.UP, "up");
gameKeys.set(me.input.KEY.S, "down");
gameKeys.set(me.input.KEY.DOWN, "down");
gameKeys.set(me.input.KEY.E, "debug");


class Keys extends me.plugin.Base{
  constructor(){
    super();
  }

  title(){
    gameKeys.forEach((action, key) => {
      me.input.unbindKey(key);
    });
    me.input.bindKey(me.input.KEY.ENTER, "enter", true);
  }

  game(){
    me.input.unbindKey(me.input.KEY.ENTER);
    gameKeys.forEach((action, key) => {
      me.input.bindKey(key, action);
    });
  }

}
export default Keys;
