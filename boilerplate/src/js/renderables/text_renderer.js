import { Bounds, collision, game, video, Text, BitmapText, Color, Entity  } from 'melonjs/dist/melonjs.module.js';

class TextRenderer extends Entity {
  constructor(x, y, settings) {
    super(x, y, settings);

    // var color = new Color(255,100,123, 1);

    var color = settings.color;

    var slug = settings.slug;
    // TODO: find something to the slug

    this.stext = slug;

    var parts = this.stext.split("\n");
    var lines = parts.length;


    var size = Math.floor(settings.height / lines);

    var text = new Text(1, 1, {
      font : "PressStart2P",
      size : size,
      textBaseline : "top",
      textAlign : "center",
      fillStyle: color,
      text : this.stext,
      offScreenCanvas: true,
      anchorPoint: { x: 0, y: 1 }
    });

    text.pos.x = x+settings.width/2.0;
    text.pos.y = y+settings.height;
    text.pos.z = 5;
    while (text.getBounds().width > settings.width && size > 7) {
      size -= 1;
      text.pos.y -= 0.5;
      text.setFont("PressStart2P", size);
      text.update();
    }
    this.text = text;
    this.body.collisionType = collision.types.WORLD_SHAPE;
    this.body.ignoreGravity=true;
    this.body.x = text.pos.x;
    this.body.y = text.pos.y;
    console.log(this);

    game.world.addChild(text);
  }

  onCollision(){
    return false;
  }

}

export default TextRenderer;
