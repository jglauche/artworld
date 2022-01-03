import { loader, Body, Rect, Bounds, ImageLayer, collision, game, video, Text, BitmapText, Color, Entity  } from 'melonjs/dist/melonjs.module.js';

class Artwork extends Entity{
  constructor(x, y, settings) {
    var slug = settings.slug;
    super(x, y, settings);
    settings.image = loader.getImage(slug);
    if (settings.image == null) {
      console.error("cannot find image for slug " + slug);
      return false;
    }
    settings.repeat = 'no-repeat';
    this.renderable = new ImageLayer(0,0, settings);

    this.body.collisionType = collision.types.WORLD_SHAPE;
    this.body.ignoreGravity=true;

    this.stext = "Image: "+ slug;
    this.name="artwork";
    console.log(this);
  }

  onCollision(){
    return false;
  }
  onBodyUpdate(body) {
      // update the entity bounds to include the body bounds
      this.getBounds().addBounds(body.getBounds(), true);
      // update the bounds pos
      this.updateBoundsPos(this.pos.x, this.pos.y);
  }

}

export default Artwork;
