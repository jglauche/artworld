
import { input, plugins, plugin, Stage, loader, level, game, ColorLayer, BitmapText  } from 'melonjs/dist/melonjs.module.js';
import PlayerEntity from 'js/renderables/player.js';
import MapEntry from 'js/renderables/map_entry.js';

class PlayScreen extends Stage {
  constructor(lvl){
    super();
    this.level = lvl;
  }

  onResetEvent() {
    plugins.fluent.set_level(this.level);

    level.load(this.level, { setViewportBounds: true });

    input.registerPointerEvent('wheel', game.viewport, function(e){
        if (e.event.deltaY < 0){ // up, scroll in
          var viewport = game.viewport;
          /*viewport.currentTransform.translate(
              viewport.width * viewport.anchorPoint.x,
              viewport.height * viewport.anchorPoint.y
          );
          viewport.currentTransform.scale(1.05);
          viewport.currentTransform.translate(
              -viewport.width * viewport.anchorPoint.x,
              -viewport.height * viewport.anchorPoint.y
          );
          game.viewport.resize(game.viewport.width-10, game.viewport.height-10)
          */
        } else {
        }
//      console.log(e.event);

    });

  }

  onDestroyEvent(){
    console.log("play stage was destroyed");
  }

  update(dt){
    var isDirty = game.world.update(dt);

    this.cameras.forEach(function(camera) {
      if (camera.update(dt)) {
        isDirty = true;
      };
    });
    return isDirty;
  }
};

export default PlayScreen;
