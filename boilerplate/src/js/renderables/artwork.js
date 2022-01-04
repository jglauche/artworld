import { plugins, loader, Body, Rect, Bounds, ImageLayer, collision, game, video, Text, BitmapText, Color, Entity  } from 'melonjs/dist/melonjs.module.js';

class Artwork extends Entity{
  constructor(x, y, settings) {
    var slug = settings.slug;
    super(x, y, settings);
    this.body.collisionType = collision.types.WORLD_SHAPE;
    this.body.ignoreGravity=true;
    this.name="artwork";

    settings.image = loader.getImage(slug);
    if (settings.image == null) {
      console.error("cannot find image for slug " + slug);
      return false;
    }
    settings.repeat = 'no-repeat';
    this.renderable = new ImageLayer(0,0, settings);

    plugins.fluent.get_slug(slug+"-title").then(txt => {
      this.stext = txt.join("");
    });
    plugins.fluent.get_slug(slug+"-desc", false).then(txt => {
      this.description = txt.join("<br/>");
    });
    plugins.fluent.get_slug(slug+"-link", false).then(txt => {
      this.link = this.link(txt.join(""));
    });
    plugins.fluent.get_slug(slug+"-licence", false).then(txt => {
      this.licence = txt.join("");
    });
    plugins.fluent.get_slug(slug+"-author", false).then(txt => {
      this.author = txt.join("");
    });
    plugins.fluent.get_slug(slug+"-surface", false).then(txt => {
      this.surface = txt.join("");
    });
    plugins.fluent.get_slug(slug+"-size", false).then(txt => {
      this.size = txt.join("");
    });

  }

  link(url, text="Link"){
    if (url != ""){
      return "<a href='"+url+"' target='_blank'><button class='link'>"+text+"</button></a>"
    } else {
      return "";
    }
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
