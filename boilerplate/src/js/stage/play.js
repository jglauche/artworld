import { Stage, loader, level, game, ColorLayer, BitmapText  } from 'melonjs/dist/melonjs.module.js';
import PlayerEntity from 'js/renderables/player.js';
import MapEntry from 'js/renderables/map_entry.js';



class PlayScreen extends Stage {
    /**
     *  action to perform on state change
     */
    onResetEvent() {

        // add a gray background to the default Stage
//        game.world.addChild(new ColorLayer("background", "#202020"));
//        loader.preload( resources, function(){} );


        level.load("artworld", { setViewportBounds: true  });


        let entry = game.world.getChildByType(MapEntry);
        // NOTE: might add something to add a random point in the rect
        // also the character moves right on entry now and I don't know why

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
