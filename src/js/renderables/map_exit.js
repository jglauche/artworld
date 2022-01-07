import { Entity, Trigger, loader, collision, plugins } from 'melonjs/dist/melonjs.module.js';
import { Artworld } from 'manifest.js';


class MapExit extends Trigger {
  constructor(x, y, settings) {
    super(x, y, settings);
    this.body.collisionType = collision.types.WORLD_SHAPE;
    this.body.ignoreGravity=true;
    this.map = settings.map;
  }

  onCollision() {
      let level = this.getTriggerSettings().to;

      // FIXME: this needs to be refactored, don't want to keep the specific level asset constants here
      switch (level) {
        case "artworld":
          loader.preload(Artworld, () => { this.load() });
        case "lobby":
          this.load();
      };
      plugins.fluent.set_level(level);
  }

  load(){
    if (this.name === "Trigger") {
        this.triggerEvent.apply(this);
    }
    return false;
  }


}

export default MapExit;
