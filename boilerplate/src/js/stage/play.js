
import { input, plugins, plugin, Stage, loader, level, game, ColorLayer, BitmapText  } from 'melonjs/dist/melonjs.module.js';
import PlayerEntity from 'js/renderables/player.js';
import MapEntry from 'js/renderables/map_entry.js';

class PlayScreen extends Stage {
  constructor(x){
    super(x);
  }

  onResetEvent() {
    var level_name = "artworld";
    plugins.fluent.set_level(level_name);

    level.load(level_name, { setViewportBounds: true });

    let entry = game.world.getChildByType(MapEntry);

    // NOTE: might add something to add a random point in the rect
    var player = new PlayerEntity(entry[0].pos.x, entry[0].pos.y, { image: 'sample_character_06' });

    game.world.addChild(player);
    input.registerPointerEvent('wheel', game.viewport, function(e){
        if (e.event.deltaY < 0){ // up, scroll in
          var viewport = game.viewport;
          viewport.currentTransform.translate(
              viewport.width * viewport.anchorPoint.x,
              viewport.height * viewport.anchorPoint.y
          );
          viewport.currentTransform.scale(1.00);
          viewport.currentTransform.translate(
              -viewport.width * viewport.anchorPoint.x,
              -viewport.height * viewport.anchorPoint.y
          );
          game.viewport.resize(game.viewport.width, game.viewport.height)
        } else {
        }
//      console.log(e.event);

    });


    // add a font text display object
    game.world.addChild(new BitmapText(game.viewport.width / 2, game.viewport.height / 2,  {
      font : "PressStart2P",
      size : 1.0,
      textBaseline : "middle",
      textAlign : "center",
      text : "Artworld.city"
    }));
  }


};

export default PlayScreen;
