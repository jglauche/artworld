import { Stage, loader, level, game, ColorLayer, BitmapText  } from 'melonjs/dist/melonjs.module.js';

class PlayScreen extends Stage {
    /**
     *  action to perform on state change
     */
    onResetEvent() {

        // add a gray background to the default Stage
//        game.world.addChild(new ColorLayer("background", "#202020"));
//        loader.preload( resources, function(){} );


        level.load("artworld", { setViewportBounds: true  });

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
