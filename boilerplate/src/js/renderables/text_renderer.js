import { plugins, Bounds, collision, game, video, Text, BitmapText, Color, Entity  } from 'melonjs/dist/melonjs.module.js';


class TextRenderer extends Entity {
  constructor(x, y, settings) {
    super(x, y, settings);

    // var color = new Color(255,100,123, 1);
    this.body.collisionType = collision.types.WORLD_SHAPE;
    this.body.ignoreGravity=true;
    var color = settings.color;

    var slug = settings.slug;
    plugins.fluent.get_slug(slug).then(parts => {
      var lines = parts.length;
      this.stext = parts.join("\n");

      var size = Math.floor(settings.height / lines);

      var text = new Text(1, 1, {
        font : "PressStart2P",
        size : size,
        textBaseline : "top",
        textAlign : "center",
        fillStyle: color,
        text : this.stext,
        offScreenCanvas: false,
        anchorPoint: { x: 0, y: 1 }
      });

      text.pos.x = x+settings.width/2.0;
      text.pos.y = y+settings.height;
      while (text.getBounds().width > settings.width && size > 7) {
        size -= 1;
        text.pos.y -= 0.5;
        text.setFont("PressStart2P", size);
        text.update();
      }
      this.text = text;
      this.text.autoTransform = true;

      game.world.addChild(text, settings.z);
      return this;
    });
  }

  onCollision(){
    return false;
  }

}

export default TextRenderer;
