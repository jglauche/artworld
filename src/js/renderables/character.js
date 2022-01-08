import { Entity, Sprite, Rect, GUI_Object, Vector2d, game, level, input, collision } from 'melonjs/dist/melonjs.module.js';

class Character extends GUI_Object {
  constructor(settings, x=0, y=0) {
    settings.width = 32;
    settings.height = 32;
    settings.framewidth = 32;
    settings.frameheight = 32;
    let img = settings.image;

    super(x, y , settings);
    this.src = settings.src;
    this.image = settings.image;
    this.img = img;
    this.anchorPoint.set(0,0);
    this.selected = settings.selected;
    this.floating = false;
    this.alwaysUpdate = true;
    this.addAnimation("stand",  [1]);
    this.setCurrentAnimation("stand");
  }

  onClick(dt) {
    this.setactive();
    return (super.update(dt));
  }

  setactive(){
    document.getElementById("charprev").src = this.src;
    document.getElementById("character").value = this.img;
  }

  onDestroyEvent(){
  }


};

export default Character;
