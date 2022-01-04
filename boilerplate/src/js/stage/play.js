
import { plugins, plugin, Stage, loader, level, game, ColorLayer, BitmapText  } from 'melonjs/dist/melonjs.module.js';
import PlayerEntity from 'js/renderables/player.js';
import MapEntry from 'js/renderables/map_entry.js';

class PlayScreen extends Stage {
  onResetEvent() {
    var level_name = "artworld";
    plugins.fluent.set_level(level_name);

    level.load(level_name, { setViewportBounds: true });


/*
    var lvl = level.getCurrentLevel().layers.find(layer => layer.name == "collisionLayer");
    if (lvl != undefined) {
      var tiles = lvl.layerData.flat().filter(x => x != null)
      // TileProperties

      debugger
    } else {
      console.warn("could not find the collision layer");
    }
*/
    let entry = game.world.getChildByType(MapEntry);
    // NOTE: might add something to add a random point in the rect

    var player = new PlayerEntity(entry[0].pos.x, entry[0].pos.y, { image: 'sample_character_06' });

    game.world.addChild(player);
//        game.world.gravity=0;

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
