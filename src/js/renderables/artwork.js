import { input, plugins, loader, Body, Rect, Bounds, ImageLayer, collision, game, video, Text, BitmapText, Color, Entity  } from 'melonjs/dist/melonjs.module.js';

class Artwork extends Entity{
  constructor(x, y, settings) {
    var slug = settings.slug;
    super(x, y, settings);
    this.body.collisionType = collision.types.WORLD_SHAPE;
    this.body.ignoreGravity=true;
    this.name="artwork";
    this.stext = "";
    this.description = "";
    this.link = "";
    this.license = "";
    this.author = "";
    this.surface = "";
    this.size = "";


    settings.image = loader.getImage(slug);
    if (settings.image == null) {
      console.error("cannot find image for slug " + slug);
      return false;
    }
    settings.repeat = 'no-repeat';
    this.renderable = new ImageLayer(0,0, settings);
    plugins.fluent.get_attributes(slug).then(txt => {
        if (txt != null){
          this.stext = this.fmt_text(txt.title);
          this.description = this.fmt_text(txt.desc);
          this.link = this.fmt_link(txt.link);
          this.license = this.fmt_text(txt.license);
          this.author = this.fmt_text(txt.author);
          this.surface = this.fmt_text(txt.surface);
          this.size = this.fmt_text(txt.size);
        }
    });

  }

  fmt_text(text){
    if (text == undefined){
      return "";
    }
    if (typeof(text) == "string"){
      return text;
    }
    // assume array, need to remove \n and format it
    return text.filter(x => x != "\n").map(x => "<p>"+x+"</p>").join("");
  }

  fmt_link(url, text="Link"){
    if (url != undefined && url != ""){
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
