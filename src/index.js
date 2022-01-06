import * as me from 'melonjs/dist/melonjs.module.js';
import 'index.css';

import TitleScreen from 'js/stage/title.js';
import PlayScreen from 'js/stage/play.js';
import PlayerEntity from 'js/renderables/player.js';
import MapEntry from 'js/renderables/map_entry.js';
import MapExit from 'js/renderables/map_exit.js';
import TextRenderer from 'js/renderables/text_renderer.js';
import Artwork from 'js/renderables/artwork.js';
import Fluent from 'js/plugin/fluent/fluent.js';

import DataManifest from 'manifest.js';

me.device.onReady(() => {
  // initialize the display canvas once the device/browser is ready
  if (!me.video.init(600, 480, {parent : "screen", renderer: me.video.CANVAS, scale : 1, scaleMethod: 'flex', consoleHeader: true, doubleBuffering: false})) {
      alert("Your browser does not support HTML5 canvas.");
      return;
  }
/*
  // initialize the debug plugin in development mode.
  if (process.env.NODE_ENV === 'development') {
      import('js/plugin/debug/debugPanel.js').then((plugin) => {
          // automatically register the debug panel
          me.utils.function.defer(me.plugin.register, this, plugin.DebugPanelPlugin, "debugPanel");
      });

  }
*/
      // allow cross-origin for image/texture loading
  me.loader.crossOrigin = "anonymous";
  me.plugin.register(Fluent, "fluent");

  me.input.bindKey(me.input.KEY.D, "right");
  me.input.bindKey(me.input.KEY.A, "left");
  me.input.bindKey(me.input.KEY.W, "up");
  me.input.bindKey(me.input.KEY.S, "down");

  me.input.bindKey(me.input.KEY.RIGHT, "right");
  me.input.bindKey(me.input.KEY.LEFT, "left");
  me.input.bindKey(me.input.KEY.UP, "up");
  me.input.bindKey(me.input.KEY.DOWN, "down");


  me.input.bindKey(me.input.KEY.E, "debug");


//  me.input.unbindPointer(me.input.pointer.LEFT);



  me.loader.preload(DataManifest, function() {

    // set the user defined game stages
//      me.state.set(me.state.MENU, new TitleScreen());
      me.state.set(me.state.PLAY, new PlayScreen("lobby"));
//      me.state.set(me.state.PLAY, new PlayScreen("artworld"));



      me.pool.register("entry", MapEntry);
      me.pool.register("exit", MapExit);
      me.pool.register("text", TextRenderer);
      me.pool.register("artwork", Artwork);
      me.pool.register("entry", PlayerEntity);

      // Start the game.
      me.state.change(me.state.PLAY);
  });
});
