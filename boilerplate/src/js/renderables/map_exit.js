import { Entity, Trigger, collision, plugins } from 'melonjs/dist/melonjs.module.js';

class MapExit extends Trigger {
  constructor(x, y, settings) {
    super(x, y, settings);
    this.body.collisionType = collision.types.WORLD_SHAPE;
    this.body.ignoreGravity=true;
    this.map = settings.map;
  }

  onCollision() {
      plugins.fluent.set_level(this.getTriggerSettings().to);

      if (this.name === "Trigger") {
          this.triggerEvent.apply(this);
      }
      return false;
  }


}

export default MapExit;
